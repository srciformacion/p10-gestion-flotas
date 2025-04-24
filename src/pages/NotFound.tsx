
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Ruta no encontrada:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <h1 className="text-6xl font-bold text-primary-blue mb-4">404</h1>
          <p className="text-xl mb-6">Lo sentimos, la página que buscas no existe</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/">Volver al inicio</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/solicitudes">Ver solicitudes</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
