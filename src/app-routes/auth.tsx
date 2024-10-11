import { Navigate, Outlet, useLocation } from "react-router-dom";
import React from "react";

const AuthRequired: React.FC = () => {
  const token = localStorage.getItem("login-system"); // Retrieve token from localStorage
  const location = useLocation(); // Capture the current location

  // If token does not exist, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />; // Allow access to the requested page (e.g., home) if logged in
};

export default AuthRequired;
