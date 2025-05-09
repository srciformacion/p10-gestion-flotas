import { useAuth } from "@/context/auth";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/types";
import { toast } from "@/components/ui/sonner";
import { useEffect } from "react";

interface RequireAuthProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
}

export const RequireAuth = ({ children, allowedRoles }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mostrar un estado de carga mientras verificamos la autenticación
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  // Handle unauthenticated users
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Special case for BI route - only admin can access
  if (location.pathname === "/admin/bi" && user.role !== "admin") {
    // Show toast notification for unauthorized access
    useEffect(() => {
      toast.error("Acceso denegado", {
        description: "No tienes permisos para acceder a esta página",
      });
    }, []);
    
    return <Navigate to="/acceso-denegado" state={{ redirectPath: "/dashboard" }} replace />;
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
