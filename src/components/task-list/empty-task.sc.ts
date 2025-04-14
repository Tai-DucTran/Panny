import styled from "styled-components";
import { theme } from "@/styles/theme";

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
`;

export const EmptyTitle = styled.h2`
  margin: 1rem 0;
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 1.5rem;
`;

export const EmptyText = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

export const AddPlantButton = styled.a`
  display: inline-block;
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.palette.axolotl};
  }
`;
