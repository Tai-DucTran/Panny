// src/components/ui/loading-spinner/index.sc.ts
import { theme } from "@/styles/theme";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

export const Spinner = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "size",
})<{ size: "small" | "medium" | "large" }>`
  width: ${({ size }) =>
    size === "small" ? "24px" : size === "large" ? "48px" : "36px"};
  height: ${({ size }) =>
    size === "small" ? "24px" : size === "large" ? "48px" : "36px"};
  border: ${({ size }) =>
      size === "small" ? "3px" : size === "large" ? "5px" : "4px"}
    solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${theme.colors.palette.russianGreen};
  animation: ${spin} 0.8s linear infinite;
`;
