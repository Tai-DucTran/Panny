// src/components/task-list/index.sc.ts
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { HealthStatus } from "@/models/plant";

export const CardWrapper = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

export const PlantInfoSection = styled.div`
  display: flex;
  padding: 1rem;
  gap: 1rem;
  align-items: center;
`;

export const PlantImageContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  background-color: ${theme.colors.palette.alabaster};

  img {
    display: block;
  }
`;

export const PlantDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const PlantNameLocation = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.palette.darkCharcoal};
  margin: 0;
`;

export const LocationText = styled.span`
  font-weight: 400;
  color: #666;
`;

// Reusable Health Status Badge
export const HealthStatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: HealthStatus }>`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  align-self: flex-start;
  background-color: ${({ status }) => {
    switch (status) {
      case HealthStatus.EXCELLENT:
        return "#2E7D32"; // Dark green
      case HealthStatus.GOOD:
        return "#4CAF50"; // Green
      case HealthStatus.FAIR:
        return "#FFC107"; // Amber
      case HealthStatus.POOR:
        return "#FF5722"; // Deep Orange
      case HealthStatus.CRITICAL:
        return "#D32F2F"; // Red
      default:
        return "#9E9E9E"; // Grey for unknown/default
    }
  }};
  color: white;
  text-transform: capitalize;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 0 1rem;
`;

export const TaskSection = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
`;

// Group text and checkbox
export const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  min-width: 200px;
`;

export const TaskTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TaskName = styled.span`
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 0.95rem;
  font-weight: 500;
`;

export const TaskDueDate = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isOverdue",
})<{ isOverdue?: boolean }>`
  color: ${({ isOverdue }) =>
    isOverdue ? theme.colors.palette.bigFootFeet : "#555"};
  font-weight: ${({ isOverdue }) => (isOverdue ? "600" : "400")};
  font-size: 0.8rem;
  margin-top: 2px;
`;

// Task completion messages
export const TaskCompletionMessage = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isError",
})<{ isError: boolean }>`
  color: ${({ isError }) =>
    isError
      ? theme.colors.palette.bigFootFeet
      : theme.colors.palette.russianGreen};
  font-weight: 500;
  font-size: 0.8rem;
  margin-top: 2px;
  font-style: italic;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const TaskCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${theme.colors.palette.russianGreen};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// Generic status badge for tasks
export const WateringStatus = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>`
  background-color: ${({ color }) => color};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
  min-width: 80px;
`;

// More tasks badge
export const MoreTasksBadge = styled.div`
  width: 100%;
  background-color: ${theme.colors.palette.morningBlue};
  color: ${theme.colors.palette.darkCharcoal};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem;
`;

export const TaskListContainer = styled.div`
  max-width: 768px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 1.5rem;
`;

export const EmptyTasksMessage = styled.p`
  text-align: center;
  color: #666;
  font-style: italic;
  margin: 2rem 0;
`;

export const UpdateMessage = styled.div`
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease-out;

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// New task status badge
export const TaskStatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>`
  background-color: ${({ color }) => color || "#4CAF50"};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
  min-width: 80px;
  display: inline-block;
`;

// Task action button
export const TaskActionButton = styled.button`
  padding: 4px 8px;
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 8px;

  &:hover {
    background-color: ${theme.colors.palette.axolotl};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
