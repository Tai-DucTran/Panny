// src/hooks/usePlantInfo.ts
import {
  geminiService,
  PlantInfoResponse,
} from "@/services/gemini/gemini-plant-service";
import { useState } from "react";

export const usePlantInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlantInfo = async (
    plantSpecies: string
  ): Promise<PlantInfoResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await geminiService.getPlantCompleteInfo(plantSpecies);
      return response;
    } catch (err) {
      setError("Failed to fetch plant information");
      console.error("Error fetching plant information:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // This keeps backward compatibility with your original method
  const getPlantInformation = async (
    plantName: string,
    requestType: "characteristics" | "care" | "illness" | "diagnosis",
    additionalContext?: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await geminiService.getPlantInformation({
        plantName,
        requestType,
        additionalContext,
      });
      return response;
    } catch (err) {
      setError("Failed to fetch plant information");
      console.error("Error fetching plant information:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchPlantInfo,
    getPlantInformation,
    loading,
    error,
  };
};
