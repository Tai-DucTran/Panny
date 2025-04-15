// src/components/garden-page/guest-notification/index.tsx
"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/auth-store";

import {
  NotificationContainer,
  NotificationText,
  SignUpButton,
} from "./index.sc";
import SignUpModal from "../sign-up-modal";

const GuestNotification: React.FC = () => {
  const { user } = useAuthStore();
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Only show for guest users
  if (!user || !user.isAnonymous) {
    return null;
  }

  return (
    <>
      <NotificationContainer>
        <NotificationText>
          {`Sign up to save your plants and data!`}
        </NotificationText>
        <SignUpButton onClick={() => setShowSignUpModal(true)}>
          Sign Up
        </SignUpButton>
      </NotificationContainer>

      {showSignUpModal && (
        <SignUpModal onClose={() => setShowSignUpModal(false)} />
      )}
    </>
  );
};

export default GuestNotification;
