// src/components/profile/index.sc.ts
import styled from "styled-components";
import { theme } from "@/styles/theme";

export const ProfileContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
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
  margin-bottom: 1.5rem;
  border: 4px solid ${theme.colors.palette.russianGreen};
  background-color: ${theme.colors.palette.alabaster};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

export const UserName = styled.h1`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: ${theme.colors.palette.darkCharcoal};
  text-align: center;
`;

export const UserEmail = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
  text-align: center;
`;

export const UserBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== "color",
})<{ color?: string }>`
  display: inline-block;
  padding: 0.3rem 0.8rem;
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
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const SectionTitle = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1.2rem;
  color: ${theme.colors.palette.darkCharcoal};
  position: relative;

  &:after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: ${theme.colors.palette.morningBlue};
    border-radius: 2px;
  }
`;

export const ProfileInfo = styled.div`
  margin-bottom: 1rem;
`;

export const ProfileLabel = styled.span`
  font-weight: 500;
  color: #666;
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
`;

export const ProfileValue = styled.span`
  display: block;
  margin-bottom: 1rem;
  color: ${theme.colors.palette.darkCharcoal};
  font-size: 1.05rem;
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

export const StatBox = styled.div`
  background-color: ${theme.colors.palette.alabaster}40;
  border-radius: 8px;
  padding: 1rem 0.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.palette.alabaster}70;
    transform: translateY(-2px);
  }
`;

export const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: ${theme.colors.palette.darkCharcoal};
  margin-bottom: 0.3rem;
`;

export const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

export const LogoutButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #c53030;
  }

  &:disabled {
    background-color: #feb2b2;
    cursor: not-allowed;
  }
`;

// New SaveDataButton for guest users
export const SaveDataButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${theme.colors.palette.axolotl};
    transform: translateY(-2px);
  }
`;

export const ConfirmationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ConfirmationDialog = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 85%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

export const ConfirmationTitle = styled.h3`
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: ${theme.colors.palette.darkCharcoal};
`;

export const ConfirmationMessage = styled.p`
  margin-bottom: 1.5rem;
  color: #4a5568;
  line-height: 1.5;
`;

export const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

export const CancelButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e2e8f0;
  }
`;

export const ConfirmButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: ${theme.colors.palette.bigFootFeet};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #c53030;
  }
`;

export const FeedbackText = styled.p`
  color: ${theme.colors.palette.darkCharcoal};
  line-height: 1.5;
  margin-bottom: 1.2rem;
  font-size: 0.95rem;
`;

export const ActionButton = styled.button`
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${theme.colors.palette.darkCharcoal};
    transform: translateY(-2px);
  }
`;

export const WhitelistForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`;

export const WhitelistInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${theme.colors.palette.russianGreen};
    box-shadow: 0 0 0 2px ${theme.colors.palette.darkCharcoal};
  }
`;

export const WhitelistButton = styled.button`
  background-color: ${theme.colors.palette.russianGreen};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.palette.darkCharcoal};
    transform: translateY(-2px);
  }
`;
