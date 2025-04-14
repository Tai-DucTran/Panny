// src/components/profile/index.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { usePlantStore } from "@/store/plant-store";
import { LoadingSpinner } from "@/components/spinner";
import * as S from "./index.sc";
import Spacer from "@/components/utils/spacer/spacer";

const ProfileComponent: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { plants } = usePlantStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoggingOut(false);
      setShowConfirmation(false);
    }
  };

  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  if (!user) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <S.ProfileContainer>
      <S.ProfileHeader>
        <S.AvatarContainer>
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt="User Avatar"
              width={120}
              height={120}
            />
          ) : (
            <User2 size={60} color="#4A5568" />
          )}
        </S.AvatarContainer>

        <S.UserName>
          {user.displayName || user.email?.split("@")[0] || "Plant Lover"}
        </S.UserName>

        <S.UserEmail>{user.email || "Anonymous User"}</S.UserEmail>

        <S.UserBadge color={user.isAnonymous ? "#805AD5" : "#38A169"}>
          {user.isAnonymous ? "Guest" : "Registered User"}
        </S.UserBadge>
      </S.ProfileHeader>

      <S.ProfileSection>
        <S.SectionTitle>Account Information</S.SectionTitle>

        <S.ProfileInfo>
          <S.ProfileLabel>Email Address</S.ProfileLabel>
          <S.ProfileValue>{user.email || "Not provided"}</S.ProfileValue>
        </S.ProfileInfo>

        <S.ProfileInfo>
          <S.ProfileLabel>Account Type</S.ProfileLabel>
          <S.ProfileValue>
            {user.isAnonymous ? "Guest Account" : "Registered Account"}
          </S.ProfileValue>
        </S.ProfileInfo>
      </S.ProfileSection>

      <S.ProfileSection>
        <S.SectionTitle>Garden Statistics</S.SectionTitle>

        <S.StatisticsGrid>
          <S.StatBox>
            <S.StatValue>{plants.length}</S.StatValue>
            <S.StatLabel>Plants</S.StatLabel>
          </S.StatBox>

          <S.StatBox>
            <S.StatValue>
              {
                plants.filter(
                  (p) =>
                    p.healthStatus === "Excellent" || p.healthStatus === "Good"
                ).length
              }
            </S.StatValue>
            <S.StatLabel>Healthy</S.StatLabel>
          </S.StatBox>

          <S.StatBox>
            <S.StatValue>
              {
                plants.filter(
                  (p) =>
                    p.healthStatus === "Fair" ||
                    p.healthStatus === "Poor" ||
                    p.healthStatus === "Critical"
                ).length
              }
            </S.StatValue>
            <S.StatLabel>Needs Care</S.StatLabel>
          </S.StatBox>
        </S.StatisticsGrid>
      </S.ProfileSection>

      <S.ProfileSection>
        <S.SectionTitle>Join Our Whitelist</S.SectionTitle>
        <S.FeedbackText>
          Get early access to upcoming features and be the first to try new
          plant care tools.
        </S.FeedbackText>
        <S.WhitelistForm
          onSubmit={(e) => {
            e.preventDefault();
            alert(
              "Thanks for joining our whitelist! We'll notify you when new features are available."
            );
          }}
        >
          <S.WhitelistInput
            type="email"
            placeholder="Your email address"
            defaultValue={user.email || ""}
            required
          />
          <S.WhitelistButton type="submit">Join Whitelist</S.WhitelistButton>
        </S.WhitelistForm>
      </S.ProfileSection>

      <S.ProfileSection>
        <S.SectionTitle>Feedback & Suggestions</S.SectionTitle>
        <S.FeedbackText>
          Help us improve Panny by sharing your ideas or reporting any issues
          you encounter.
        </S.FeedbackText>
        <S.ActionButton
          onClick={() =>
            (window.location.href =
              "mailto:support@pannyapp.com?subject=Panny Feedback")
          }
        >
          Send Feedback
        </S.ActionButton>
      </S.ProfileSection>

      <Spacer size={20} />

      <S.LogoutButton onClick={handleLogoutClick} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Log Out"}
      </S.LogoutButton>

      {showConfirmation && (
        <S.ConfirmationOverlay>
          <S.ConfirmationDialog>
            <S.ConfirmationTitle>Log Out?</S.ConfirmationTitle>
            <S.ConfirmationMessage>
              Are you sure you want to log out of your account?
            </S.ConfirmationMessage>

            <S.ConfirmationButtons>
              <S.CancelButton onClick={handleCancelLogout}>
                Cancel
              </S.CancelButton>
              <S.ConfirmButton onClick={handleConfirmLogout}>
                {isLoggingOut ? <LoadingSpinner size="small" /> : "Log Out"}
              </S.ConfirmButton>
            </S.ConfirmationButtons>
          </S.ConfirmationDialog>
        </S.ConfirmationOverlay>
      )}
    </S.ProfileContainer>
  );
};

export default ProfileComponent;
