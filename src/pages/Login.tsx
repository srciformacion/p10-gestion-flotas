
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
  LogIn,
  ArrowRight
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
      <main className="flex-grow flex flex-col md:flex-row">
        <div className="flex flex-col justify-center p-6 md:p-12 md:w-1/2 bg-gradient-to-br from-[#78BE20] to-[#62A01A]">
          <div className="max-w-md mx-auto text-white">
            <h1 className="text-3xl font-bold mb-6">Bienvenido a AmbulLink</h1>
            <p className="text-lg mb-8">La plataforma de gestión de traslados sanitarios diseñada para profesionales del sector.</p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 space-y-6">
              <h2 className="text-xl font-medium">Acceso rápido</h2>
              <p className="text-sm opacity-90">
                Prueba la plataforma con nuestras cuentas de demostración para conocer todas las funcionalidades.
              </p>
              
              <div className="space-y-3">
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-between gap-2 bg-white text-emerald-700 hover:bg-gray-100 border-transparent"
                  onClick={() => handleQuickLogin("admin")}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Administrador</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Button>
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-between gap-2 bg-white text-blue-700 hover:bg-gray-100 border-transparent"
                  onClick={() => handleQuickLogin("hospital")}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span className="font-medium">Centro médico</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Button>
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-between gap-2 bg-white text-indigo-700 hover:bg-gray-100 border-transparent"
                  onClick={() => handleQuickLogin("individual")}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    <span className="font-medium">Paciente</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Button>
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-between gap-2 bg-white text-orange-700 hover:bg-gray-100 border-transparent"
                  onClick={() => handleQuickLogin("ambulance")}
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <Ambulance className="h-4 w-4" />
                    <span className="font-medium">Servicio de ambulancias</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-70" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-12 bg-white">
          <Card className="w-full max-w-md border shadow-md">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
              <CardDescription>
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
