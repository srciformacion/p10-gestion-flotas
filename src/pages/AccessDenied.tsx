
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ShieldAlert } from "lucide-react";

const AccessDenied = () => {
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
              <Link to="/dashboard">Ir al Dashboard</Link>
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
