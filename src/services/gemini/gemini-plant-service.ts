import { HealthStatus, Plant } from "@/models/plant";
import { geminiModel } from "../firebase/firebase-config";

export interface PlantInfoRequest {
  plantName: string;
  requestType: "characteristics" | "care" | "illness" | "diagnosis";
  additionalContext?: string;
}
export interface PlantInfoResponse {
  description: string;
  plantData: Partial<Plant>;
  diagnosis?: string;
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

  async getPlantCompleteInfo(
    plantSpecies: string,
    healthStatus?: HealthStatus,
    notes?: string
  ): Promise<PlantInfoResponse> {
    const prompt = this.buildCompletePrompt(plantSpecies, healthStatus, notes);

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
        prompt = `
        You are a plant health specialist. Based on the following information, provide a diagnosis and care recommendations for a ${plantName}:
        
        User's description: ${
          additionalContext || "No additional information provided."
        }
        
        Please include:
        1. Potential causes for the plant's current condition
        2. Specific care actions to improve the plant's health
        3. Preventive measures to avoid similar issues in the future
        
        Format your response in markdown with clear sections and bullet points where appropriate.
        `;
        break;
    }

    return prompt;
  }

  private buildCompletePrompt(
    plantSpecies: string,
    healthStatus?: HealthStatus,
    notes?: string
  ): string {
    let prompt = `
    I need detailed information about ${plantSpecies} houseplant for my plant care app. Please provide:
  
    1. A detailed but concise human-readable description of the plant, its characteristics, care needs, and any special considerations.
  
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
    `;

    // Add diagnosis request if health status is provided
    if (
      healthStatus &&
      (healthStatus === HealthStatus.FAIR ||
        healthStatus === HealthStatus.POOR ||
        healthStatus === HealthStatus.CRITICAL)
    ) {
      prompt += `\n\n3. Considering that the plant appears to be in ${healthStatus.toLowerCase()} condition`;

      if (notes) {
        prompt += ` and the user noted: "${notes}"`;
      }

      prompt += `, provide a diagnosis and care recommendations to improve the plant's health. 
      Include potential causes for the plant's current condition, specific actions to improve its health, 
      and preventive measures to avoid similar issues in the future. Format this as markdown with clear sections and bullet points.`;
    }

    prompt += `\n\nOnly include fields where you have high confidence in the information. 
    Return the human-readable description followed by the JSON object, with the JSON clearly delimited.
    Format your response exactly like this:
    <description>
    [Plant description here]
    </description>
    <plantData>
    [JSON data here]
    </plantData>`;

    // Add diagnosis tag if health status is provided
    if (
      healthStatus &&
      (healthStatus === HealthStatus.FAIR ||
        healthStatus === HealthStatus.POOR ||
        healthStatus === HealthStatus.CRITICAL)
    ) {
      prompt += `
    <diagnosis>
    [Diagnosis and care recommendations here]
    </diagnosis>`;
    }

    return prompt;
  }

  private parseResponse(responseText: string): PlantInfoResponse {
    const descriptionMatch = responseText.match(
      /<description>([\s\S]*?)<\/description>/
    );
    const plantDataMatch = responseText.match(
      /<plantData>([\s\S]*?)<\/plantData>/
    );
    const diagnosisMatch = responseText.match(
      /<diagnosis>([\s\S]*?)<\/diagnosis>/
    );

    const description = descriptionMatch ? descriptionMatch[1].trim() : "";
    const diagnosis = diagnosisMatch ? diagnosisMatch[1].trim() : undefined;
    let plantData: Partial<Plant> = {};

    if (plantDataMatch) {
      try {
        // Clean the JSON string before parsing
        let jsonString = plantDataMatch[1].trim();

        // Remove markdown code blocks if present
        jsonString = jsonString.replace(/```json|```/g, "").trim();

        plantData = JSON.parse(jsonString);
      } catch (error) {
        console.error("Error parsing plant data JSON:", error);
      }
    }

    return { description, plantData, diagnosis };
  }
}

// Create a singleton instance
export const geminiService = new GeminiService();
