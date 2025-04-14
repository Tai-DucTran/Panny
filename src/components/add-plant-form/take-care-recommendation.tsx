// src/components/add-plant-form/take-care-recommendation.tsx
import React from "react";
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

interface TakeCareRecommendationProps {
  healthStatus: HealthStatus;
  diagnosis: string; // This prop will receive the diagnosis from parent
}

const TakeCareRecommendation: React.FC<TakeCareRecommendationProps> = ({
  healthStatus,
  diagnosis, // Accept the diagnosis from props
}) => {
  // Loading state - true if diagnosis is empty
  const loading = !diagnosis;

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
      ) : !diagnosis ? (
        <RecommendationContent>
          <p>
            Unable to provide diagnosis at this time. Please try again later.
          </p>
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
