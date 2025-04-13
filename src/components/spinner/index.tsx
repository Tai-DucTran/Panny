// src/components/ui/loading-spinner/index.tsx
import React from "react";
import { SpinnerContainer, Spinner } from "./index.sc";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
}) => {
  return (
    <SpinnerContainer>
      <Spinner size={size} />
    </SpinnerContainer>
  );
};
