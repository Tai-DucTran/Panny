// src/components/tasks/task-list.sc.ts
import styled from "styled-components";
import { theme } from "@/styles/theme";

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

export const TaskCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isCompleted",
})<{ isCompleted?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: ${({ isCompleted }) => (isCompleted ? 0.7 : 1)};
  border-left: 4px solid
    ${({ isCompleted }) =>
      isCompleted
        ? theme.colors.palette.morningBlue
        : theme.colors.palette.bigFootFeet};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const PlantImageContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin-right: 1rem;
  flex-shrink: 0;
`;

export const TaskInfo = styled.div`
  flex: 1;
`;

export const PlantName = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: ${theme.colors.palette.darkCharcoal};
`;

export const TaskDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TaskLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isCompleted",
})<{ isCompleted?: boolean }>`
  font-size: 0.9rem;
  color: ${({ isCompleted }) => (isCompleted ? "#888" : "#555")};
  text-decoration: ${({ isCompleted }) =>
    isCompleted ? "line-through" : "none"};
`;

export const DueDate = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "isOverdue" && prop !== "isCompleted",
})<{ isOverdue?: boolean; isCompleted?: boolean }>`
  font-size: 0.85rem;
  color: ${({ isOverdue, isCompleted }) =>
    isCompleted
      ? "#888"
      : isOverdue
      ? theme.colors.palette.bigFootFeet
      : "#555"};
  font-weight: ${({ isOverdue, isCompleted }) =>
    isCompleted ? "normal" : isOverdue ? "bold" : "normal"};
`;

export const ActionButton = styled.button`
  background-color: ${theme.colors.palette.morningBlue};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.palette.darkCharcoal};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const CompletedButton = styled.button`
  background-color: transparent;
  color: #888;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: default;
  margin-left: 1rem;
`;

export const StatusDot = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: "pending" | "completed" | "overdue" | "upcoming" }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${({ status }) =>
    status === "completed"
      ? theme.colors.palette.morningBlue
      : status === "overdue"
      ? theme.colors.palette.bigFootFeet
      : status === "upcoming"
      ? theme.colors.palette.russianGreen
      : "#FFC107"};
`;
