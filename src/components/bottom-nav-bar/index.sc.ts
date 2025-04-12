import styled from "styled-components";
import { theme } from "@/styles/theme";
import Link from "next/link";

export const NavWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 64px;
  background-color: ${theme.colors.palette.darkCharcoal};
  border-top: 1px solid ${theme.colors.palette.alabaster};
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 50;
  max-width: 768px;
`;

// Filter `isSelected` so it doesn't go to the DOM
export const NavItem = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>`
  background: none;
  border: none;
  color: ${({ isSelected }) =>
    isSelected
      ? theme.colors.palette.alabaster
      : theme.colors.palette.morningBlue};
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: ${theme.colors.palette.whiteCoffee};
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;
