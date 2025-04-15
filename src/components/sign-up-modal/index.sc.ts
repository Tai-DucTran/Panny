// src/components/profile/signup-modal.sc.ts
import styled from "styled-components";
import { theme } from "@/styles/theme";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 0 16px;
`;

export const ModalContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out forwards;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 1.5rem;
  font-weight: 600;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${theme.colors.palette.darkCharcoal};
  }
`;

export const ModalForm = styled.form`
  padding: 24px;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #4a5568;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.palette.russianGreen};
    box-shadow: 0 0 0 3px rgba(106, 142, 102, 0.1);
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: #e53e3e;
  margin-top: 2px;
  margin-bottom: 16px;
  font-size: 0.875rem;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;

  &:hover {
    background-color: ${theme.colors.palette.axolotl};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e2e8f0;
  }
`;

export const MessageContainer = styled.div`
  padding: 16px 24px 0;
`;

export const InfoMessage = styled.p`
  background-color: #ebf8ff;
  border-left: 4px solid #4299e1;
  padding: 12px 16px;
  margin: 0;
  color: #2c5282;
  font-size: 0.95rem;
  border-radius: 4px;
`;

// Success state styling
export const SuccessContainer = styled.div`
  padding: 32px 24px;
  text-align: center;
`;

export const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  background-color: ${theme.colors.palette.russianGreen};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 24px;
  color: white;
`;

export const SuccessTitle = styled.h2`
  color: ${theme.colors.palette.darkCharcoal};
  margin: 0 0 16px;
  font-size: 1.8rem;
`;

export const SuccessMessage = styled.p`
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
`;
