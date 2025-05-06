import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/sonner";
import { ArrowRight, AlertTriangle, Info } from "lucide-react";
import { TestAccountsSection } from "./TestAccountsSection";

interface LoginFormProps {
  from?: string;
}

export const LoginForm = ({ from = "/dashboard" }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loginAttemptCount, setLoginAttemptCount] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);
    setLoginAttemptCount(prev => prev + 1);
    
    if (!email || !password) {
      setErrorMessage("Por favor ingresa tu email y contraseña");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log(`Intento de login #${loginAttemptCount + 1} para: ${email}`);
      
      // Intento de login directo con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email, 
        password
      });
      
      if (error) {
        console.error("Error de autenticación:", error);
        
        // Mensaje personalizado según el código de error
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage(`Credenciales inválidas (#${loginAttemptCount + 1}). Por favor verifica tu email y contraseña. Recuerda que la contraseña para las cuentas de prueba es 123456.`);
        } else {
          setErrorMessage(`Error: ${error.message} (Intento #${loginAttemptCount + 1})`);
        }
        
        setIsLoading(false);
        return;
      }
      
      if (!data.user) {
        setErrorMessage(`No se recibieron datos del usuario (Intento #${loginAttemptCount + 1})`);
        setIsLoading(false);
        return;
      }
      
      console.log('Login exitoso, datos recibidos:', data);
      
      toast.success("Inicio de sesión exitoso", {
        description: "Bienvenido de nuevo a AmbulLink"
      });
      
      // Navegar después de un login exitoso
      navigate(from, { replace: true });
      
    } catch (error: any) {
      console.error("Error inesperado en inicio de sesión:", error);
      setErrorMessage(`Error inesperado: ${error.message || "Desconocido"} (Intento #${loginAttemptCount + 1})`);
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestAccount = (testEmail: string) => {
    setEmail(testEmail);
    setPassword("123456");
    setErrorMessage(null);
    setInfoMessage(`Cuenta de prueba seleccionada: ${testEmail}. Haz clic en "Iniciar sesión" para continuar.`);
  };

  // Test de conexión directo
  const testDirectConnection = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage("Probando conexión directa a Supabase...");
    
    try {
      // 1. Probar ping básico
      const { data: pingData, error: pingError } = await supabase.from('profiles').select('count').limit(1);
      
      if (pingError) {
        setInfoMessage(`Error de conexión: ${pingError.message}`);
      } else {
        setInfoMessage("Conexión a Supabase establecida correctamente. Intentando autenticación de prueba...");
        
        // 2. Probar autenticación
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "admin@ambulink.com",
          password: "123456"
        });
        
        if (error) {
          setErrorMessage(`Error en test de autenticación: ${error.message}`);
        } else if (data.user) {
          setInfoMessage(`Test exitoso! Usuario autenticado: ${data.user.email}`);
        } else {
          setErrorMessage("Test de autenticación falló: No se devolvió usuario");
        }
      }
    } catch (error: any) {
      setErrorMessage(`Error en test: ${error.message || "Desconocido"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      {infoMessage && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{infoMessage}</AlertDescription>
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
      
      <Button 
        variant="outline" 
        className="w-full mt-2"
        onClick={testDirectConnection}
        disabled={isLoading}
      >
        {isLoading ? "Probando..." : "Diagnosticar conexión"}
      </Button>

      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link to="/registro" className="font-medium text-primary-blue hover:underline">
          Crear cuenta
        </Link>
      </div>
      
      <TestAccountsSection onSelectAccount={fillTestAccount} />
    </>
  );
};
