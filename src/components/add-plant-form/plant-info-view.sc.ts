// src/components/add-plant-form/plant-info-view.sc.ts
import { theme } from "@/styles/theme";
import styled from "styled-components";

export const InfoContainer = styled.div`
  margin-bottom: 2rem;
`;

export const PlantInfoBox = styled.div`
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid ${theme.colors.palette.morningBlue};
  margin-bottom: 1.5rem;
`;

export const PlantInfoHeader = styled.h4`
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 1.2rem;
`;

export const PlantInfoText = styled.div`
  line-height: 1.6;

  p {
    margin-top: 0;
  }
`;

export const CollapsedText = styled.p`
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.6;
`;

export const ExpandableButton = styled.button`
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: ${theme.colors.palette.morningBlue};
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: ${theme.colors.palette.darkCharcoal};
  }
`;

export const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const LoadingText = styled.p`
  color: ${theme.colors.palette.darkCharcoal};
  margin: 0;
`;
