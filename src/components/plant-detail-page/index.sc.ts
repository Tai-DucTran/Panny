import { HealthStatus } from "@/models/plant";
import { theme } from "@/styles/theme";
import styled from "styled-components";
import { TaskStatus } from "@/models/tasks";

export const TopFold = styled.div`
  display: flex;
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eaeaea;
  border-radius: 8px;
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 60px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
`;

export const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
`;

export const InfoLabel = styled.span`
  font-weight: 500;
  color: #666;
  font-size: 0.85rem;
  margin-right: 0.5rem;
  width: 100px;
`;

export const InfoValue = styled.span`
  font-size: 0.85rem;
  color: #333;
`;

export const HealthStatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: HealthStatus }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
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
        return "#4CAF50"; // Default green
    }
  }};
  color: white;
`;

export const DetailsSection = styled.section`
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  margin: 0 0 0.75rem 0;
  color: ${theme.colors.palette.darkCharcoal};
`;

export const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
`;

export const DetailItemLabel = styled.span`
  font-weight: 500;
  color: #666;
  font-size: 0.85rem;
  margin-right: 0.5rem;
  width: 120px;
`;

export const DetailItemValue = styled.span`
  font-size: 0.9rem;
  color: #333;
`;

export const TaskItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  border-left: 3px solid ${theme.colors.palette.russianGreen};
`;

export const TaskInfo = styled.div`
  flex: 1;
`;

export const TaskName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: ${theme.colors.palette.darkCharcoal};
`;

export const TaskDate = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
`;

export const TaskStatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: TaskStatus }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ status }) =>
    status === TaskStatus.COMPLETED ? "#4CAF50" : "#FFC107"};
  color: ${({ status }) =>
    status === TaskStatus.COMPLETED ? "white" : "#333"};
`;

export const ActionButton = styled.button`
  padding: 0.4rem 0.75rem;
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 0.5rem;

  &:hover {
    background-color: ${theme.colors.palette.axolotl};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
