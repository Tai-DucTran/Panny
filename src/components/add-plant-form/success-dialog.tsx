// src/components/add-plant-form/success-dialog.tsx
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SuccessDialogOverlay,
  SuccessDialogContent,
  SuccessIcon,
  SuccessTitle,
  SuccessMessage,
} from "./index.sc";

interface SuccessDialogProps {
  plantName: string;
  isOpen: boolean;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ plantName, isOpen }) => {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Redirect to homepage after 2 seconds
      const redirectTimer = setTimeout(() => {
        router.push("/");
      }, 1500);

      // Cleanup timer if component unmounts
      return () => clearTimeout(redirectTimer);
    }
  }, [isOpen, router]);

  if (!isOpen) return null;

  return (
    <SuccessDialogOverlay>
      <SuccessDialogContent>
        <SuccessIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </SuccessIcon>
        <SuccessTitle>Plant Added!</SuccessTitle>
        <SuccessMessage>
          {plantName} has been successfully added to your collection.
        </SuccessMessage>
      </SuccessDialogContent>
    </SuccessDialogOverlay>
  );
};

export default SuccessDialog;
