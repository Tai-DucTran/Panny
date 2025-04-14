// src/components/add-plant-form/take-care-recommendation.tsx
import React, { useState } from "react";
import {
  RecommendationContainer,
  RecommendationTitle,
  RecommendationContent,
  LoadingRecommendation,
  StatusBadge,
  CollapsedMarkdownContent,
  MarkdownContent,
  ExpandableButton,
} from "./take-care-recommendation.sc";
import { LoadingSpinner } from "@/components/spinner";
import { HealthStatus } from "@/models/plant";
import ReactMarkdown from "react-markdown";

interface TakeCareRecommendationProps {
  healthStatus: HealthStatus;
  diagnosis: string;
}

const TakeCareRecommendation: React.FC<TakeCareRecommendationProps> = ({
  healthStatus,
  diagnosis,
}) => {
  const [expanded, setExpanded] = useState(false);
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
      ) : (
        <RecommendationContent>
          {expanded ? (
            <MarkdownContent>
              <ReactMarkdown>{diagnosis}</ReactMarkdown>
            </MarkdownContent>
          ) : (
            <CollapsedMarkdownContent>
              <ReactMarkdown>{diagnosis}</ReactMarkdown>
            </CollapsedMarkdownContent>
          )}
          <ExpandableButton onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show Less" : "Read More"}
          </ExpandableButton>
        </RecommendationContent>
      )}
    </RecommendationContainer>
  );
};

export default TakeCareRecommendation;
