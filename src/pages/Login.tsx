
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
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
              {/* TestAccountsSection is now included in the LoginForm */}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
