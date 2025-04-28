
import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/types";
import { toast } from "@/components/ui/sonner";
import { useEffect } from "react";

interface RequireAuthProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
}

export const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const { user } = useAuth();
  const location = useLocation();

  // Handle unauthenticated users
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle unauthorized access (wrong role)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Show toast notification for unauthorized access
    useEffect(() => {
      toast.error("Acceso denegado", {
        description: "No tienes permisos para acceder a esta página",
      });
    }, []);
    
    // Get default redirect path based on user role
    let redirectPath = "/dashboard";
    
    if (user.role === "individual") {
      redirectPath = "/solicitudes";
    } else if (user.role === "ambulance") {
      redirectPath = "/dashboard";
    } else if (user.role === "hospital") {
      redirectPath = "/dashboard";
    } else if (user.role === "admin") {
      redirectPath = "/admin";
    }
    
    return <Navigate to="/acceso-denegado" state={{ redirectPath }} replace />;
  }

  return children;
};
