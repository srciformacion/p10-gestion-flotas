
import { useState } from "react";
import { useAuth } from "@/context/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { toast } from "@/components/ui/sonner";
import { 
  User, 
  Building, 
  UserCircle, 
  Ambulance,
  LogIn
} from "lucide-react";

const Login = () => {
  const { simulateDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const handleQuickLogin = async (role: UserRole) => {
    setIsLoading(true);
    
    try {
      toast.info(`Iniciando sesión como ${role}...`);
      
      await simulateDemoLogin(role);
      
      toast.success(`Sesión iniciada como ${role}`, {
        description: "Redirigiendo al panel de control..."
      });
      
      // Redirigir según el rol
      switch(role) {
        case "admin":
          navigate("/admin/dashboard", { replace: true });
          break;
        case "hospital":
        case "individual":
        case "ambulance":
        default:
          navigate("/dashboard", { replace: true });
          break;
      }
      
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-corporate-green to-corporate-green-dark items-center justify-center p-12">
          <div className="max-w-md text-white">
            <h1 className="text-3xl font-bold mb-6">Bienvenido a AmbulLink</h1>
            <p className="text-lg mb-8">La plataforma de gestión de traslados sanitarios para profesionales del sector.</p>
            
            <div className="border border-white/30 bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-medium">Acceso rápido en modo demo</h2>
              <p className="text-sm opacity-80">
                Prueba la plataforma con nuestras cuentas de demostración para conocer todas las funcionalidades.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="secondary"
                  className="flex items-center justify-center gap-2 bg-white text-corporate-green hover:bg-gray-100"
                  onClick={() => handleQuickLogin("admin")}
                  disabled={isLoading}
                >
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
                <Button 
                  variant="secondary"
                  className="flex items-center justify-center gap-2 bg-white text-corporate-green hover:bg-gray-100"
                  onClick={() => handleQuickLogin("hospital")}
                  disabled={isLoading}
                >
                  <Building className="h-4 w-4" />
                  <span>Hospital</span>
                </Button>
                <Button 
                  variant="secondary"
                  className="flex items-center justify-center gap-2 bg-white text-corporate-green hover:bg-gray-100"
                  onClick={() => handleQuickLogin("individual")}
                  disabled={isLoading}
                >
                  <UserCircle className="h-4 w-4" />
                  <span>Paciente</span>
                </Button>
                <Button 
                  variant="secondary"
                  className="flex items-center justify-center gap-2 bg-white text-corporate-green hover:bg-gray-100"
                  onClick={() => handleQuickLogin("ambulance")}
                  disabled={isLoading}
                >
                  <Ambulance className="h-4 w-4" />
                  <span>Ambulancia</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Iniciar sesión</CardTitle>
              <CardDescription className="text-center">
                Ingresa tus credenciales para acceder a AmbulLink
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <LoginForm from={from} />
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <div className="md:hidden w-full space-y-4">
                <h3 className="text-sm font-medium text-center">Acceso rápido con cuentas de prueba</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("admin")}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("hospital")}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Building className="h-4 w-4" />
                    <span>Hospital</span>
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("individual")}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <UserCircle className="h-4 w-4" />
                    <span>Particular</span>
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickLogin("ambulance")}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Ambulance className="h-4 w-4" />
                    <span>Ambulancia</span>
                  </Button>
                </div>
              </div>
              
              <Link to="/demo-accounts" className="text-center text-sm text-muted-foreground hover:underline">
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
        </div>
      </main>
    </div>
  );
};

export default Login;
