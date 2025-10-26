import React, { useState } from "react";
import { LoginPage } from "../../src/components/LoginPage";
import { ForgotPasswordPage } from "../components/ForgotPasswordPage";
import { SignupPage } from "../components/SignupPage";
import Dashboard from "./Dashboard";

type AuthPage = "login" | "signup" | "forgot-password";

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>("login");

  // Authentication handlers
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleSignupSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleForgotPasswordSuccess = () => {
    setAuthPage("login");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthPage("login");
  };

  // Conditional rendering
  if (!isAuthenticated) {
    switch (authPage) {
      case "signup":
        return (
          <SignupPage
            onSignupSuccess={handleSignupSuccess}
            onSwitchToLogin={() => setAuthPage("login")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordPage
            onBackToLogin={() => setAuthPage("login")}
            onResetSuccess={handleForgotPasswordSuccess}
          />
        );
      default:
        return (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onSwitchToSignup={() => setAuthPage("signup")}
            onSwitchToForgotPassword={() => setAuthPage("forgot-password")}
          />
        );
    }
  }

  // Once authenticated
  return (
    <div className="p-6 text-center">
      <>
        <Dashboard />
      </>
    </div>
  );
};

export default Login;
