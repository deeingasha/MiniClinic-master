import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * ProtectedRoute component that checks if a user is authenticated
 * and has the appropriate role to access a route
 * 
 * @param children - The React elements to render if access is granted
 * @param allowedRoles - Optional list of roles that can access this route
 * @returns The children components if access is allowed, otherwise redirects to login
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user } = useAuthStore();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles are required or user is admin, allow access
  if (!allowedRoles || allowedRoles.length === 0 || user?.role === "admin") {
    return <>{children}</>;
  }

  // Check if user has an allowed role
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // If user doesn't have required role, redirect to home page
  // We could create a custom unauthorized page instead
  return <Navigate to="/" replace />;
};
