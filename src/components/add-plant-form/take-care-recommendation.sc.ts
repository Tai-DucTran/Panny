// src/components/add-plant-form/take-care-recommendation.sc.ts
import { theme } from "@/styles/theme";
import styled from "styled-components";

export const RecommendationContainer = styled.div`
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid ${theme.colors.palette.morningBlue};
  margin-bottom: 1.5rem;
`;

export const RecommendationTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 1.4rem;
`;

export const RecommendationContent = styled.div`
  line-height: 1.6;
`;

export const LoadingRecommendation = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

export const StatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-left: 0.5rem;
  color: white;
  background-color: ${({ status }) => {
    switch (status) {
      case "Excellent":
        return "#2e7d32"; // Green
      case "Good":
        return "#558b2f"; // Light Green
      case "Fair":
        return "#ff8f00"; // Amber
      case "Poor":
        return "#d84315"; // Deep Orange
      case "Critical":
        return "#b71c1c"; // Red
      default:
        return "#757575"; // Grey
    }
  }};
`;
