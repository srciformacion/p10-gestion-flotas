
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LandingHero } from "@/components/LandingHero";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario está autenticado, redirigir al dashboard
    if (user && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando aplicación..." />
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar la página de inicio
  if (!user) {
    return <LandingHero />;
  }

  // Mientras se hace la redirección, mostrar loading
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Redirigiendo al dashboard..." />
    </div>
  );
};

export default Index;
