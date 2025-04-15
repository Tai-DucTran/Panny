// src/components/profile/signup-modal.tsx
"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { LoadingSpinner } from "@/components/spinner";
import * as S from "./index.sc";

interface SignUpModalProps {
  onClose: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { signUp, loading, error, clearError } = useAuthStore();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (formError) setFormError("");
    if (error) clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (formError) setFormError("");
    if (error) clearError();
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (formError) setFormError("");
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!email || !password || !confirmPassword) {
      setFormError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return;
    }

    try {
      await signUp(email, password);
      setIsSuccess(true);
      // Close modal automatically after success message
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error in sign-up process: ", error);
    }
  };

  return (
    <S.ModalOverlay>
      <S.ModalContainer>
        {isSuccess ? (
          <S.SuccessContainer>
            <S.SuccessIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
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
            </S.SuccessIcon>
            <S.SuccessTitle>Account Created!</S.SuccessTitle>
            <S.SuccessMessage>
              Your account has been successfully created. Your plants and data
              have been saved to your new account.
            </S.SuccessMessage>
          </S.SuccessContainer>
        ) : (
          <>
            <S.ModalHeader>
              <S.ModalTitle>Create Your Account</S.ModalTitle>
              <S.CloseButton onClick={onClose}>×</S.CloseButton>
            </S.ModalHeader>

            <S.MessageContainer>
              <S.InfoMessage>
                Save your plants and data by creating an account. This will
                allow you to access your garden from any device.
              </S.InfoMessage>
            </S.MessageContainer>

            <S.ModalForm onSubmit={handleSubmit}>
              <S.FormGroup>
                <S.Label htmlFor="email">Email</S.Label>
                <S.Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Your email address"
                  disabled={loading}
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label htmlFor="password">Password</S.Label>
                <S.Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Create a password"
                  disabled={loading}
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label htmlFor="confirmPassword">Confirm Password</S.Label>
                <S.Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </S.FormGroup>

              {(formError || error) && (
                <S.ErrorMessage>{formError || error}</S.ErrorMessage>
              )}

              <S.SubmitButton type="submit" disabled={loading}>
                {loading ? <LoadingSpinner size="small" /> : "Create Account"}
              </S.SubmitButton>

              <S.CancelButton type="button" onClick={onClose}>
                Cancel
              </S.CancelButton>
            </S.ModalForm>
          </>
        )}
      </S.ModalContainer>
    </S.ModalOverlay>
  );
};

export default SignUpModal;
