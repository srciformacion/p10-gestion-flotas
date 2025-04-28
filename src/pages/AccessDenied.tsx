
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ShieldAlert, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AccessDenied = () => {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as { redirectPath?: string } | undefined;
  
  // Determine where to redirect the user based on role
  const getRedirectPath = () => {
    if (state?.redirectPath) {
      return state.redirectPath;
    }

    if (!user) return "/";
    
    switch (user.role) {
      case "admin":
        return "/admin";
      case "ambulance":
        return "/solicitudes";
      case "hospital":
        return "/dashboard";
      case "individual":
        return "/solicitudes";
      default:
        return "/";
    }
  };

  const redirectPath = getRedirectPath();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground mb-6">
            No tienes permisos suficientes para acceder a esta página.
            Si crees que esto es un error, por favor contacta con el administrador.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to={redirectPath}>
                <Home className="mr-2 h-4 w-4" />
                Ir a mi página principal
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccessDenied;
