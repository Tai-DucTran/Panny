"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";

import { LoadingSpinner } from "../spinner";
import AuthPage from ".";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, initialized } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  // Handle client-side only rendering to avoid hydration errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // Show loading spinner until auth state is initialized
  if (loading || !initialized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show auth page if user is not authenticated
  if (!user) {
    return <AuthPage />;
  }

  // Show protected content if user is authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
