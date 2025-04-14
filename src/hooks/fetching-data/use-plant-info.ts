// src/hooks/fetching-data/use-plant-info.ts
import { useState } from "react";
import {
  geminiService,
  PlantInfoResponse,
} from "@/services/gemini/gemini-plant-service";
import { HealthStatus } from "@/models/plant";

interface UsePlantInfoResult {
  loading: boolean;
  error: string | null;
  plantInfo: PlantInfoResponse | null;
  fetchPlantInfo: (
    plantName: string,
    healthStatus?: HealthStatus,
    notes?: string
  ) => Promise<PlantInfoResponse | null>;
}

export const usePlantInfo = (): UsePlantInfoResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plantInfo, setPlantInfo] = useState<PlantInfoResponse | null>(null);

  const fetchPlantInfo = async (
    plantName: string,
    healthStatus?: HealthStatus,
    notes?: string
  ): Promise<PlantInfoResponse | null> => {
    if (!plantName) {
      setError("Plant name is required");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Use the Gemini service to get plant information with optional diagnosis
      const response = await geminiService.getPlantCompleteInfo(
        plantName,
        healthStatus,
        notes
      );

      setPlantInfo(response);
      setLoading(false);
      return response;
    } catch (err) {
      console.error("Error fetching plant info:", err);
      setError("Unable to load plant information. Please try again later.");
      setLoading(false);
      return null;
    }
  };

  return {
    loading,
    error,
    plantInfo,
    fetchPlantInfo,
  };
};
