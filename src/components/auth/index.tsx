"use client";

import { useState } from "react";
import LoginForm from "./login-form";
import SignUpForm from "./sign-up-form";

enum AuthMode {
  LOGIN,
  SIGNUP,
}

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);

  const handleSwitchToSignUp = () => {
    setAuthMode(AuthMode.SIGNUP);
  };

  const handleSwitchToLogin = () => {
    setAuthMode(AuthMode.LOGIN);
  };

  return (
    <div>
      {authMode === AuthMode.LOGIN ? (
        <LoginForm onSwitchToSignUp={handleSwitchToSignUp} />
      ) : (
        <SignUpForm onSwitchToLogin={handleSwitchToLogin} />
      )}
    </div>
  );
};

export default AuthPage;
