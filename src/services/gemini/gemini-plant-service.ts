// src/services/geminiService.ts
import { Plant } from "@/models/plant";
import { geminiModel } from "../firebase/firebase-config";

export interface PlantInfoRequest {
  plantName: string;
  requestType: "characteristics" | "care" | "illness" | "diagnosis";
  additionalContext?: string;
}

export interface PlantInfoResponse {
  description: string;
  plantData: Partial<Plant>;
}

export class GeminiService {
  async getPlantInformation(request: PlantInfoRequest): Promise<string> {
    const prompt = this.buildPrompt(request);

    try {
      const result = await geminiModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      return result.response.text();
    } catch (error) {
      console.error("Error calling Gemini model:", error);
      throw error;
    }
  }

  async getPlantCompleteInfo(plantSpecies: string): Promise<PlantInfoResponse> {
    const prompt = this.buildCompletePrompt(plantSpecies);

    try {
      const result = await geminiModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      const responseText = result.response.text();
      return this.parseResponse(responseText);
    } catch (error) {
      console.error(
        "Error calling Gemini model for complete plant info:",
        error
      );
      throw error;
    }
  }

  private buildPrompt(request: PlantInfoRequest): string {
    const { plantName, requestType, additionalContext } = request;

    let prompt = "";
    switch (requestType) {
      case "characteristics":
        prompt = `Provide detailed information about ${plantName} including its appearance, native habitat, and general characteristics.`;
        break;
      case "care":
        prompt = `Provide comprehensive care instructions for ${plantName}, including watering, light, soil, temperature, and humidity requirements.`;
        break;
      case "illness":
        prompt = `List the common diseases and issues that affect ${plantName}, including symptoms and treatments.`;
        break;
      case "diagnosis":
        prompt = `Based on the following description, diagnose the issue with the ${plantName}: ${additionalContext}`;
        break;
    }

    return prompt;
  }

  private buildCompletePrompt(plantSpecies: string): string {
    return `
    I need detailed information about ${plantSpecies} houseplant for my plant care app. Please provide:

    1. A detailed but concise human-readable description of the plant, its characteristics, care needs, illness, diagnosis and any special considerations.

    2. A JSON object that conforms to my Plant interface with the following structure:
    
    {
      "species": "${plantSpecies}",
      "careDifficulty": "VERY_EASY|EASY|MODERATE|DIFFICULT|EXPERT",
      "sensitivityFactors": ["OVERWATERING"|"UNDERWATERING"|"TEMPERATURE_FLUCTUATIONS"|"DRAFTS"|"HUMIDITY_CHANGES"|"LIGHT_CHANGES"|"ROOT_DISTURBANCE"|"FERTILIZER"|"WATER_QUALITY"|"PESTS"],
      "wateringFrequency": number of days between watering,
      "sunlightNeeds": "LOW"|"MEDIUM"|"BRIGHT_INDIRECT"|"DIRECT",
      "humidityPreference": "LOW"|"MEDIUM"|"HIGH",
      "temperature": {
        "min": minimum temperature in celsius,
        "max": maximum temperature in celsius,
        "ideal": ideal temperature in celsius
      },
      "soilType": ["STANDARD"|"CACTUS"|"ORCHID"|"PEAT"|"PERLITE"|"VERMICULITE"|"COCO_COIR"|"SAND"|"BARK"],
      "repottingFrequency": number of months between repotting,
      "toxicity": "NONE"|"MILD"|"MODERATE"|"SEVERE",
      "growthHabit": "UPRIGHT"|"BUSHY"|"TRAILING"|"CLIMBING"|"ROSETTE",
      "origin": geographic origin of the plant
    }

    Only include fields where you have high confidence in the information. Do NOT use markdown formatting such as code blocks in your response. Return the human-readable description followed by the JSON object, with the JSON clearly delimited.
    Format your response exactly like this:
    <description>
    [Plant description here]
    </description>
    <plantData>
    [JSON data here]
    </plantData>
    `;
  }

  private parseResponse(responseText: string): PlantInfoResponse {
    const descriptionMatch = responseText.match(
      /<description>([\s\S]*?)<\/description>/
    );
    const plantDataMatch = responseText.match(
      /<plantData>([\s\S]*?)<\/plantData>/
    );

    const description = descriptionMatch ? descriptionMatch[1].trim() : "";
    let plantData: Partial<Plant> = {};

    if (plantDataMatch) {
      try {
        plantData = JSON.parse(plantDataMatch[1].trim());
      } catch (error) {
        console.error("Error parsing plant data JSON:", error);
      }
    }

    return { description, plantData };
  }
}

// Create a singleton instance
export const geminiService = new GeminiService();
