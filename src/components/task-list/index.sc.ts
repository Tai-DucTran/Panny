// src/components/task-list/plant-task-card.sc.ts
import styled from "styled-components";
import { theme } from "@/styles/theme";
import { HealthStatus } from "@/models/plant"; // Import HealthStatus enum

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
  background-color: ${theme.colors.palette
    .alabaster}; /* Placeholder background */

  img {
    display: block; /* Remove extra space below image */
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

// Reusable Health Status Badge (similar to plant-detail-page)
export const HealthStatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: HealthStatus }>`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  align-self: flex-start; /* Align badge to the start */
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
  text-transform: capitalize; /* Make status look nicer */
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 0 1rem; /* Add horizontal margin */
`;

export const TaskSection = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: row; /* Arrange tasks horizontally */
  flex-wrap: wrap; /* Allow tasks to wrap to the next line if needed */
  gap: 1.5rem; /* Add space between horizontal task items */
  align-items: center; /* Align items vertically if they wrap */
`;

// --- MODIFIED TaskItem ---
// It now just groups text and checkbox together closely
export const TaskItem = styled.div`
  display: flex;
  align-items: center; /* Vertically center text block and checkbox */
  gap: 8px; /* Gap between text container and checkbox */
  /* Remove justify-content: space-between; */
`;

// TaskTextContainer remains the same
export const TaskTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// TaskName remains the same
export const TaskName = styled.span`
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 0.95rem;
  font-weight: 500;
`;

// TaskDueDate remains the same
export const TaskDueDate = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isOverdue",
})<{ isOverdue?: boolean }>`
  color: ${({ isOverdue }) =>
    isOverdue ? theme.colors.palette.bigFootFeet : "#555"};
  font-weight: ${({ isOverdue }) => (isOverdue ? "600" : "400")};
  font-size: 0.8rem;
  margin-top: 2px;
`;

// TaskCheckbox remains the same
export const TaskCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${theme.colors.palette.russianGreen};
`;

// MoreTasksBadge remains the same - will appear below the wrapped tasks if count > MAX_TASKS_DISPLAY
export const MoreTasksBadge = styled.div`
  /* Add width: 100% to make it take full width if tasks wrap */
  width: 100%;
  background-color: ${theme.colors.palette.morningBlue};
  color: ${theme.colors.palette.darkCharcoal};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  margin-top: 1rem; /* Adjust spacing if needed */
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

// Definition is here:
export const EmptyTasksMessage = styled.p`
  text-align: center;
  color: #666;
  font-style: italic;
  margin: 2rem 0;
`;
