// src/components/profile/index.sc.ts
import styled from "styled-components";
import { theme } from "@/styles/theme";

export const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

export const AvatarContainer = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 4px solid ${theme.colors.palette.morningBlue};
  background-color: ${theme.colors.palette.alabaster};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const UserName = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: ${theme.colors.palette.darkCharcoal};
`;

export const UserEmail = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
`;

export const UserBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  background-color: ${(props) =>
    props.color || theme.colors.palette.russianGreen};
  color: white;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

export const ProfileSection = styled.div`
  margin-bottom: 2rem;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const SectionTitle = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: ${theme.colors.palette.darkCharcoal};
`;

export const ProfileInfo = styled.div`
  margin-bottom: 1rem;
`;

export const ProfileLabel = styled.span`
  font-weight: 500;
  color: #666;
  display: block;
  margin-bottom: 0.3rem;
`;

export const ProfileValue = styled.span`
  display: block;
  margin-bottom: 1rem;
`;

export const LogoutButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c53030;
  }

  &:disabled {
    background-color: #feb2b2;
    cursor: not-allowed;
  }
`;
