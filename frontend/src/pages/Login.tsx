import React, { useState } from "react";
// import { LoginPage } from "../../../admin-dashboard/src/components/LoginPage";
import { LoginPage } from "../../src/components/LoginPage";

type Props = {};
type AuthPage = "login" | "signup" | "forgot-password";

const Login = (props: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [mode, setMode] = useState<"admin" | "user">("admin");
  const [currentView, setCurrentView] = useState("dashboard");

  // Authentication handlers
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setAuthPage("login");
  };

  const handleSignupSuccess = () => {
    setIsAuthenticated(true);
    setAuthPage("login");
  };

  const handleForgotPasswordSuccess = () => {
    setAuthPage("login");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthPage("login");
    setCurrentView("dashboard");
  };
  return (
    <div>
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setAuthPage("signup")}
        onSwitchToForgotPassword={() => setAuthPage("forgot-password")}
      />
    </div>
  );
};

export default Login;
