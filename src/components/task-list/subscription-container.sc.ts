// src/components/task-list/subscription-container.sc.ts
import styled from "styled-components";
import { theme } from "@/styles/theme";

export const SubscriptionWrapper = styled.div`
  height: 120px;
  width: 100%;
  background-color: ${theme.colors.palette.jetStream};
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const SubscriptionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.palette.darkCharcoal};
  margin: 0 0 4px 0;
`;

export const SubscriptionSubtitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 400;
  color: ${theme.colors.palette.darkCharcoal};
  margin: 0 0 12px 0;
`;

export const SubscriptionForm = styled.form`
  display: flex;
  gap: 8px;
`;

export const SubscriptionInput = styled.input`
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border: 1px solid ${theme.colors.palette.whiteCoffee};
  border-radius: 4px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.palette.russianGreen};
    box-shadow: 0 0 0 2px rgba(106, 142, 102, 0.2);
  }
`;

export const SubscriptionButton = styled.button`
  height: 40px;
  padding: 0 16px;
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.palette.axolotl};
  }
`;
