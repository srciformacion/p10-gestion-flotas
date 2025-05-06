
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { toast } from "@/components/ui/sonner";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      console.log('Usuario autenticado, redirigiendo a:', from);
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Verificar el estado de la sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("Sesión activa detectada al cargar Login");
      } else {
        console.log("No hay sesión activa al cargar Login");
      }
    };
    
    checkSession();
  }, []);

  const handleQuickLogin = async (role: string) => {
    setIsLoading(true);
    
    try {
      toast.info(`Iniciando sesión como ${role}...`);
      
      // En lugar de intentar autenticar con Supabase, simulamos la autenticación
      // y redirigimos directamente al dashboard
      
      setTimeout(() => {
        toast.success(`Sesión iniciada como ${role}`, {
          description: "Redirigiendo al panel de control..."
        });
        
        // Redirigir según el rol
        switch(role) {
          case "admin":
            navigate("/admin/dashboard", { replace: true });
            break;
          case "hospital":
          case "user":
          case "ambulance":
          default:
            navigate("/dashboard", { replace: true });
            break;
        }
      }, 1500); // Pequeño retraso para mostrar las notificaciones
      
    } catch (error) {
      console.error("Error en la demostración:", error);
      toast.error("Error de demostración", {
        description: "No se pudo completar la acción de demostración."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
              <CardDescription>
                Ingresa tus credenciales para acceder a AmbulLink
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LoginForm from={from} />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full border-t pt-4">
                <h3 className="text-sm font-medium mb-2 text-center">Acceso rápido con cuentas de prueba</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleQuickLogin("admin")}
                    disabled={isLoading}
                  >
                    Entrar como Admin
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleQuickLogin("hospital")}
                    disabled={isLoading}
                  >
                    Entrar como Hospital
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleQuickLogin("user")}
                    disabled={isLoading}
                  >
                    Entrar como Usuario
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleQuickLogin("ambulance")}
                    disabled={isLoading}
                  >
                    Entrar como Ambulancia
                  </Button>
                </div>
              </div>
              <Link to="/demo-accounts" className="w-full">
                <Button variant="secondary" className="w-full">
                  Ver todas las cuentas de demostración
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
