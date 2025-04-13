// src/components/AddPlantForm/AddPlantForm.styles.ts
import { theme } from "@/styles/theme";
import styled from "styled-components";

export const StyledFormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const FormTitle = styled.h1`
  text-align: center;
  color: ${theme.colors.palette.darkCharcoal};
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

export const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`;

export const StepDot = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(active) => (active ? "#2e7d32" : "#e0e0e0")};
  color: ${(active) => (active ? "white" : "#757575")};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  transition: all 0.3s ease;
`;

export const StepConnector = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>`
  width: 60px;
  height: 3px;
  background-color: ${(active) => (active ? "#2e7d32" : "#e0e0e0")};
  transition: all 0.3s ease;
`;

export const StepContainer = styled.div`
  min-height: 300px;
`;

export const StepTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 1.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #2e7d32;
    box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.2);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

export const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "variant",
})<{ variant: "primary" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${(props) =>
    props.variant === "primary"
      ? theme.colors.palette.darkCharcoal
      : "#f5f5f5"};
  color: ${(props) => (props.variant === "primary" ? "white" : "#333")};

  &:hover {
    background-color: ${(props) =>
      props.variant === "primary" ? "#1b5e20" : "#e0e0e0"};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PlantDescription = styled.div`
  background-color: #f1f8e9;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #7cb342;

  h4 {
    margin-top: 0;
    color: #33691e;
  }

  p {
    margin-bottom: 0;
    line-height: 1.6;
  }
`;

export const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
`;

export const StyledCheckbox = styled.input`
  margin-right: 0.5rem;
`;

export const CheckboxLabel = styled.label`
  font-size: 0.9rem;
`;

export const SuccessDialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const SuccessDialogContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
`;

export const SuccessIcon = styled.div`
  width: 70px;
  height: 70px;
  background-color: ${theme.colors.palette.darkCharcoal};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1.5rem;

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

export const SuccessTitle = styled.h2`
  color: ${theme.colors.palette.darkCharcoal};
  margin-bottom: 1rem;
  font-size: 1.8rem;
`;

export const SuccessMessage = styled.p`
  font-size: 1.1rem;
  color: #666;
`;
