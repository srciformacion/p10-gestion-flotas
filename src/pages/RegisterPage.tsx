
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { User, UserRole } from "@/types";
import { Truck } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("individual");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password, role);
      toast({
        title: "Registro exitoso",
        description: "Bienvenido a P10 - Gestión de usuarios y flota",
      });
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Error al registrar el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: "individual", label: "Usuario particular" },
    { value: "hospital", label: "Centro sanitario" },
    { value: "ambulance", label: "Empresa de ambulancias" }
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
                Crear nueva cuenta
              </CardTitle>
              <CardDescription className="text-gray-600">
                Complete el formulario para registrarse en P10 - Gestión de usuarios y flota
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo o razón social</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre completo o razón social"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Tipo de usuario</Label>
                  <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-rioja-green hover:bg-rioja-green/90 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Registrando..." : "Registrarse"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter>
              <div className="w-full text-center">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <Link to="/login" className="font-medium text-rioja-green hover:underline">
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
