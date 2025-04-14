// src/components/add-plant-form/take-care-recommendation.tsx
import React, { useEffect } from "react";
import {
  RecommendationContainer,
  RecommendationTitle,
  RecommendationContent,
  LoadingRecommendation,
  StatusBadge,
} from "./take-care-recommendation.sc";
import { LoadingSpinner } from "@/components/spinner";
import { HealthStatus } from "@/models/plant";
import ReactMarkdown from "react-markdown";
import { usePlantDiagnosis } from "@/hooks/fetching-data/use-plant-diagnosis";

interface TakeCareRecommendationProps {
  plantName: string;
  healthStatus: HealthStatus;
  notes: string;
}

const TakeCareRecommendation: React.FC<TakeCareRecommendationProps> = ({
  plantName,
  healthStatus,
  notes,
}) => {
  const { diagnosis, loading, error, fetchDiagnosis } = usePlantDiagnosis();

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

  useEffect(() => {
    const getRecommendation = async () => {
      if (!plantName || !healthStatus) return;
      await fetchDiagnosis(plantName, healthStatus, notes);
    };

    getRecommendation();
  }, [plantName, healthStatus, notes, fetchDiagnosis]);

  // Don't show anything if we don't have health status information
  if (!healthStatus) return null;

  // Only display this component for FAIR, POOR, or CRITICAL health statuses
  if (
    healthStatus !== HealthStatus.FAIR &&
    healthStatus !== HealthStatus.POOR &&
    healthStatus !== HealthStatus.CRITICAL
  ) {
    return null;
  }

  return (
    <RecommendationContainer>
      <RecommendationTitle>
        Your plant appears to be in {getHealthStatusLabel(healthStatus)}{" "}
        condition
        <StatusBadge status={healthStatus}>{healthStatus}</StatusBadge>
      </RecommendationTitle>

      {loading ? (
        <LoadingRecommendation>
          <LoadingSpinner size="small" />
          <span>Getting care recommendations...</span>
        </LoadingRecommendation>
      ) : error ? (
        <RecommendationContent>
          <p>{error}</p>
        </RecommendationContent>
      ) : (
        <RecommendationContent>
          <ReactMarkdown>{diagnosis}</ReactMarkdown>
        </RecommendationContent>
      )}
    </RecommendationContainer>
  );
};

export default TakeCareRecommendation;
