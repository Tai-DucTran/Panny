"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import * as S from "./index.sc";

interface LoginFormProps {
  onSwitchToSignUp: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const { signIn, signInAnonymously, loading, error, clearError } =
    useAuthStore();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!email || !password) {
      setFormError("Please enter both email and password");
      return;
    }

    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Error in sign-in process: ", error);
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      await signInAnonymously();
    } catch (error) {
      console.error("Error in sign-in anonymously process: ", error);
    }
  };

  return (
    <S.AuthContainer>
      <S.LogoContainer>
        <Image
          src="/images/panny-baby-logo.webp"
          alt="Logo"
          width={100}
          height={100}
          priority
        />
      </S.LogoContainer>

      <S.AuthTitle>Log In to Your Account</S.AuthTitle>

      <form onSubmit={handleSubmit}>
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
            placeholder="Your password"
            disabled={loading}
          />
        </S.FormGroup>

        {(formError || error) && (
          <S.ErrorMessage>{formError || error}</S.ErrorMessage>
        )}

        <S.Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </S.Button>
      </form>

      <S.SeparatorContainer>
        <S.Separator />
        <S.SeparatorText>or</S.SeparatorText>
        <S.Separator />
      </S.SeparatorContainer>

      <S.SecondaryButton
        type="button"
        onClick={handleAnonymousSignIn}
        disabled={loading}
      >
        Continue as Guest
      </S.SecondaryButton>

      <S.SwitchContainer>
        {`Don't have an account? `}
        <S.SwitchLink onClick={onSwitchToSignUp}>Sign Up</S.SwitchLink>
      </S.SwitchContainer>
    </S.AuthContainer>
  );
};

export default LoginForm;
