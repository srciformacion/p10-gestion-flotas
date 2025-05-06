
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { handleError } from "@/utils/errorHandler";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  // Redirigir si el usuario ya está autenticado
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage("Por favor ingresa tu email y contraseña");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Intentando iniciar sesión con:', email);
      await login(email, password);
      console.log('Login exitoso');
      toast.success("Inicio de sesión exitoso", {
        description: "Bienvenido de nuevo a AmbulLink"
      });
    } catch (error: any) {
      console.error("Error de inicio de sesión:", error);
      
      // Mensajes de error más específicos según el código de error
      let message = "Error al iniciar sesión. Verifica tus credenciales e inténtalo nuevamente.";
      
      if (typeof error.message === 'string') {
        if (error.message.includes("Invalid login credentials")) {
          message = "Credenciales inválidas. Por favor verifica tu email y contraseña.";
        } else if (error.message.includes("Email not confirmed")) {
          message = "Tu email no ha sido confirmado. Verifica tu bandeja de entrada.";
        } else if (error.message.includes("too many requests")) {
          message = "Demasiados intentos fallidos. Por favor intenta más tarde.";
        } else {
          message = `Error: ${error.message}`;
        }
      }
      
      console.log('Mensaje de error configurado:', message);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const testAccounts = [
    { email: "admin@ambulink.com", role: "Administrador" },
    { email: "hospital@ambulink.com", role: "Centro sanitario" },
    { email: "usuario@ambulink.com", role: "Usuario particular" },
    { email: "ambulancia@ambulink.com", role: "Empresa de ambulancias" }
  ];
  
  const fillTestAccount = (testEmail: string) => {
    setEmail(testEmail);
    setPassword("123456");
    setErrorMessage(null);
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
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link
                      to="/recuperar-password"
                      className="text-sm font-medium text-primary hover:underline"
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
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <Link to="/registro" className="font-medium text-primary-blue hover:underline">
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
                      className="text-xs justify-start"
                      onClick={() => fillTestAccount(account.email)}
                    >
                      <span className="truncate">{account.role}</span>
                      <ArrowRight className="ml-auto h-3 w-3" />
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

export default Login;
