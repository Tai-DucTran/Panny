import { theme } from "@/styles/theme";
import styled from "styled-components";

export const CardContainer = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  max-width: 100%;
  background-color: white;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

export const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 133%;
`;

export const StatusBadge = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${({ color }) => color};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;

export const CardContent = styled.div`
  padding: 16px;
`;

export const PlantName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: ${theme.colors.palette.darkCharcoal};
`;

export const PlantSpecies = styled.p`
  margin: 0 0 8px 0;
  color: #666;
  font-size: 0.9rem;
  font-style: italic;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

export const WateringInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WateringLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

export const WateringValue = styled.p`
  margin: 0;
  font-weight: bold;
  font-size: 0.9rem;
`;

export const WateringStatus = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>`
  background-color: ${({ color }) => color};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;
