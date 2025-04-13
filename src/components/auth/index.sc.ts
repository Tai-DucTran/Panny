// src/components/auth/index.sc.ts
import styled from "styled-components";
import { theme } from "@/styles/theme";

export const AuthContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const AuthTitle = styled.h1`
  text-align: center;
  color: ${theme.colors.palette.darkCharcoal};
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.palette.russianGreen};
    box-shadow: 0 0 0 2px rgba(106, 142, 102, 0.2);
  }
`;

export const ErrorMessage = styled.p`
  color: #e53e3e;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

export const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.palette.axolotl};
  }

  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  margin-top: 0.75rem;

  &:hover {
    background-color: #e2e8f0;
  }
`;

export const SeparatorContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
`;

export const Separator = styled.div`
  flex: 1;
  height: 1px;
  background-color: #e2e8f0;
`;

export const SeparatorText = styled.span`
  padding: 0 1rem;
  color: #718096;
  font-size: 0.875rem;
`;

export const SwitchContainer = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #4a5568;
`;

export const SwitchLink = styled.span`
  color: ${theme.colors.palette.russianGreen};
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;
