import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, userRole, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect to login if admin access is required but user is not admin
  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
