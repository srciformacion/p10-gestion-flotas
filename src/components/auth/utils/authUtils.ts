
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const testDirectConnection = async (setIsLoading: (loading: boolean) => void, setErrorMessage: (message: string | null) => void, setInfoMessage: (message: string | null) => void) => {
  setIsLoading(true);
  setErrorMessage(null);
  setInfoMessage("Probando conexión directa a Supabase...");
  
  try {
    // 1. Probar ping básico
    const { data: pingData, error: pingError } = await supabase.from('profiles').select('count').limit(1);
    
    if (pingError) {
      console.error("Error de ping:", pingError);
      setInfoMessage(`Error de conexión: ${pingError.message}`);
    } else {
      console.log("Ping exitoso:", pingData);
      setInfoMessage("Conexión a Supabase establecida correctamente. Intentando autenticación de prueba...");
      
      // 2. Probar autenticación con cuenta de prueba
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "admin@ambulink.com",
        password: "123456"
      });
      
      console.log("Resultado de autenticación:", { data, error });
      
      if (error) {
        setErrorMessage(`Error en test de autenticación: ${error.message} (código: ${error.name})`);
      } else if (data.user) {
        setInfoMessage(`Test exitoso! Usuario autenticado: ${data.user.email}`);
      } else {
        setErrorMessage("Test de autenticación falló: No se devolvió usuario");
      }
    }
  } catch (error: any) {
    console.error("Error en test de conexión:", error);
    setErrorMessage(`Error en test: ${error.message || "Desconocido"}`);
  } finally {
    setIsLoading(false);
  }
};

export const handleLogin = async (
  email: string,
  password: string,
  loginAttemptCount: number,
  setLoginAttemptCount: (count: number) => void,
  setIsLoading: (loading: boolean) => void,
  setErrorMessage: (message: string | null) => void,
  setInfoMessage: (message: string | null) => void,
  login: (email: string, password: string) => Promise<void>,
  navigate: (path: string, options?: any) => void,
  from: string
) => {
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
    
    // Asegurar que no hay espacios en blanco al inicio o final
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    
    // Usar el método login del contexto de autenticación
    await login(cleanEmail, cleanPassword);
    
    toast.success("Inicio de sesión exitoso", {
      description: "Bienvenido de nuevo a AmbulLink"
    });
    
    // Navegar después de un login exitoso
    navigate(from, { replace: true });
    
  } catch (error: any) {
    console.error("Error en inicio de sesión:", error);
    
    // Mensaje personalizado según el código de error
    if (error.message?.includes("Invalid login credentials")) {
      setErrorMessage(`Credenciales inválidas (#${loginAttemptCount + 1}). Por favor verifica tu email y contraseña. Recuerda que la contraseña para las cuentas de prueba es 123456.`);
    } else {
      setErrorMessage(`Error: ${error.message || "Desconocido"} (Intento #${loginAttemptCount + 1})`);
    }
  } finally {
    setIsLoading(false);
  }
};
