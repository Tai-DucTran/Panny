// src/hooks/fetching-data/use-plant-diagnosis.ts
import { useState } from "react";
import { geminiService } from "@/services/gemini/gemini-plant-service";
import { HealthStatus } from "@/models/plant";

export interface UsePlantDiagnosisResult {
  diagnosis: string;
  loading: boolean;
  error: string | null;
  fetchDiagnosis: (
    plantName: string,
    healthStatus: HealthStatus,
    notes?: string
  ) => Promise<string>;
}

export const usePlantDiagnosis = (): UsePlantDiagnosisResult => {
  const [diagnosis, setDiagnosis] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to get health status display text
  const getHealthStatusLabel = (status: HealthStatus): string => {
    switch (status) {
      case HealthStatus.EXCELLENT:
        return "excellent";
      case HealthStatus.GOOD:
        return "good";
      case HealthStatus.FAIR:
        return "fair";
      case HealthStatus.POOR:
        return "poor";
      case HealthStatus.CRITICAL:
        return "critical";
      default:
        return "unknown";
    }
  };

  const fetchDiagnosis = async (
    plantName: string,
    healthStatus: HealthStatus,
    notes?: string
  ): Promise<string> => {
    if (!plantName || !healthStatus) {
      setError("Plant name and health status are required");
      return "";
    }

    try {
      setLoading(true);
      setError(null);

      // Generate context based on health status and notes
      const additionalContext = notes
        ? `The plant appears to be in ${getHealthStatusLabel(
            healthStatus
          )} condition. User notes: ${notes}`
        : `The plant appears to be in ${getHealthStatusLabel(
            healthStatus
          )} condition.`;

      const response = await geminiService.getPlantInformation({
        plantName,
        requestType: "diagnosis",
        additionalContext,
      });

      setDiagnosis(response);
      setLoading(false);
      return response;
    } catch (err) {
      console.error("Error fetching plant diagnosis:", err);
      setError("Unable to load diagnosis. Please try again later.");
      setLoading(false);
      return "";
    }
  };

  return {
    diagnosis,
    loading,
    error,
    fetchDiagnosis,
  };
};
