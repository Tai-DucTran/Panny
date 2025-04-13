// src/components/profile/index.tsx
"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import * as S from "./index.sc"; // You'll need to create this styled-components file

const ProfileComponent: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null; // Should never happen with protected routes
  }

  return (
    <S.ProfileContainer>
      {/* Display user info */}
      <h1>Profile</h1>
      <div>
        <p>Email: {user.email || "Anonymous User"}</p>
        <p>Account Type: {user.isAnonymous ? "Guest" : "Registered User"}</p>
      </div>

      <button onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Log Out"}
      </button>
    </S.ProfileContainer>
  );
};

export default ProfileComponent;
