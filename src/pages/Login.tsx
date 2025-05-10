
import { useState } from "react";
import { useAuth } from "@/context/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const { simulateDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6">
        <Card className="w-full max-w-md border shadow-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
              <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <CardDescription>
              Ingresa tus credenciales para acceder a AmbulLink
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm from={from} />
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 border-t pt-4">
            <Link to="/demo-accounts" className="text-center text-sm text-primary hover:underline">
              Ver todas las cuentas de demostración
            </Link>
            
            <div className="flex items-center w-full">
              <span className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?
              </span>
              <Link to="/registro" className="text-sm font-medium text-primary hover:underline ml-1">
                Crear cuenta
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
