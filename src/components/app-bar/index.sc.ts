import { theme } from "@/styles/theme";
import { styled } from "styled-components";

export const CustomAppBar = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  color: ${theme.colors.palette.russianGreen};
  position: sticky;
  top: 0;
  z-index: 10;
  position: relative;
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.palette.darkCharcoal};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  margin-right: 1rem;
  size: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
  flex: 1;
  color: ${theme.colors.palette.darkCharcoal};
  text-align: center;
`;
