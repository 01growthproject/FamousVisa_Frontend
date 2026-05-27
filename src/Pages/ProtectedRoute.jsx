import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // ✅ Check if token exists in localStorage
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  // ✅ If no token, redirect to login
  if (!token) {
    console.warn("🔐 No token found - Redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // ✅ Optional: Validate token format (basic check)
  if (typeof token !== "string" || token.length < 10) {
    console.warn("❌ Invalid token format - Redirecting to login");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // ✅ Optional: Check user data
  if (!user) {
    console.warn("⚠️ User data missing - Redirecting to login");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  // ✅ Token exists - Allow access
  return children;
};

export default ProtectedRoute;