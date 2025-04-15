// src/components/add-plant-form/camera-modal.sc.ts
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
  max-width: 450px;
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
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 1.3rem;
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

export const ModalContent = styled.div`
  padding: 20px;
`;

export const FeatureImage = styled.div`
  position: relative;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ComingSoonTitle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const ComingSoonText = styled.p`
  margin-bottom: 24px;
  color: ${theme.colors.palette.darkCharcoal};
  line-height: 1.6;
  text-align: center;
`;

export const SubscribeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SubscribeInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.palette.russianGreen};
    box-shadow: 0 0 0 2px rgba(106, 142, 102, 0.1);
  }
`;

export const SubscribeButton = styled.button`
  padding: 12px;
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.palette.axolotl};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const SuccessMessage = styled.div`
  padding: 16px;
  background-color: rgba(72, 187, 120, 0.1);
  border: 1px solid rgba(72, 187, 120, 0.2);
  border-radius: 6px;
  color: #2f855a;
  font-weight: 500;
  text-align: center;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
