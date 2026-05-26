import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../Utils/AuthContext";

/**
 * Route guard. Supports BOTH patterns:
 *
 *  1) Children pattern (your App.jsx):
 *       <ProtectedRoute><Wrapper /></ProtectedRoute>
 *
 *  2) Layout/Outlet pattern:
 *       <Route element={<ProtectedRoute />}>...</Route>
 *
 * Pass `requireAdmin` to restrict to admin users.
 */
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Wait for the token-bootstrap to finish before deciding.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // children when used as a wrapper; Outlet when used as a layout route.
  return children ? children : <Outlet />;
}
