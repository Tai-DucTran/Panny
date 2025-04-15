// src/components/garden-page/guest-notification/index.sc.ts
import styled from "styled-components";
import { theme } from "@/styles/theme";

export const NotificationContainer = styled.div`
  background-color: #bfd0c1;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const NotificationText = styled.h3`
  margin: 0 0 16px 0;
  color: ${theme.colors.palette.darkCharcoal};
`;

export const SignUpButton = styled.button`
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.palette.axolotl};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
