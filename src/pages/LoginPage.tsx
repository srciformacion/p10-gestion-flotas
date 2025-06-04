
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Truck } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // Precargar email si viene desde la página de inicio
  useEffect(() => {
    const stateEmail = (location.state as any)?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo a AmbulLink",
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Datos de prueba para facilitar las pruebas
  const testAccounts = [
    { email: "admin@ambulink.com", role: "Administrador" },
    { email: "hospital@ambulink.com", role: "Centro sanitario" },
    { email: "usuario@ambulink.com", role: "Usuario particular" },
    { email: "ambulancia@ambulink.com", role: "Empresa de ambulancias" },
    { email: "coordinador@ambulink.com", role: "Centro Coordinador" },
    { email: "equipo@ambulink.com", role: "Equipo Móvil" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-rioja-green rounded-lg flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Iniciar sesión
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ingresa tus credenciales para acceder a P10 - Gestión de usuarios y flota.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Usuario</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
                    <Link
                      to="/recuperar-password"
                      className="text-sm font-medium text-rioja-green hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-rioja-green hover:bg-rioja-green/90 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar sesión →"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link to="/registro" className="font-medium text-rioja-green hover:underline">
                  Crear cuenta
                </Link>
              </div>
              
              <div className="w-full border-t pt-4">
                <p className="text-xs text-center text-gray-500 mb-2">
                  Cuentas de prueba (usar contraseña: 123456)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {testAccounts.map((account) => (
                    <Button
                      key={account.email}
                      variant="outline"
                      size="sm"
                      className="text-xs justify-start border-gray-300 hover:bg-gray-50"
                      onClick={() => setEmail(account.email)}
                    >
                      <span className="truncate text-gray-700">{account.role}</span>
                      <ArrowRight className="ml-auto h-3 w-3 text-gray-400" />
                    </Button>
                  ))}
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
