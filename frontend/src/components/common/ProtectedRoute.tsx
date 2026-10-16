import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex-1 min-h-[50vh] grid place-items-center bg-void select-none">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="w-8 h-8 animate-spin text-ion"
            strokeWidth={2.5}
          />
          <p className="text-sm font-black tracking-wider text-mist">
            Authenticating Node Context...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
