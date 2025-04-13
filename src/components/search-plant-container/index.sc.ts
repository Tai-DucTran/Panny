// src/components/search-plant-container/index.sc.ts
import styled from "styled-components";
import { theme } from "@/styles/theme";

export const Container = styled.div`
  width: 100%;
  max-width: 36rem;
  margin: 0 auto;
  padding: 1rem;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

export const Form = styled.form`
  margin-bottom: 1.5rem;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.palette.russianGreen};
  }
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${theme.colors.palette.axolotl};
  }
`;

export const ErrorContainer = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #fee2e2;
  border-left: 4px solid #ef4444;
  color: #b91c1c;
`;

export const InfoSection = styled.div`
  margin-top: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

export const DescriptionBox = styled.div`
  padding: 1rem;
  background-color: #ecfdf5;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`;

export const CodeBox = styled.pre`
  padding: 1rem;
  background-color: #f3f4f6;
  border-radius: 0.375rem;
  overflow: auto;
  font-family: var(--font-geist-mono), monospace;
`;
