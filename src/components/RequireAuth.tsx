
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/types";

interface RequireAuthProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
}

export const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return children;
};
