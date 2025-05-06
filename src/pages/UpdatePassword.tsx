
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Si el usuario ya está autenticado, redirigirlo al dashboard
  useEffect(() => {
    if (user && !isSuccess) {
      navigate("/dashboard");
    }
  }, [user, navigate, isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      toast.error("Error", {
        description: "Las contraseñas no coinciden",
      });
      return;
    }

    // Validar que la contraseña sea lo suficientemente segura
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      toast.error("Error", {
        description: "La contraseña debe tener al menos 8 caracteres",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Actualizar la contraseña usando Supabase
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Contraseña actualizada", {
        description: "Tu contraseña ha sido actualizada correctamente",
      });

      // Redirigir al usuario después de 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Error al actualizar la contraseña:", error);
      setError(error.message || "No se pudo actualizar la contraseña");
      toast.error("Error", {
        description: error.message || "No se pudo actualizar la contraseña",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Actualizar contraseña</CardTitle>
            <CardDescription>
              {isSuccess
                ? "Tu contraseña ha sido actualizada correctamente"
                : "Crea una nueva contraseña para tu cuenta"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Tu contraseña ha sido actualizada correctamente. Serás redirigido al inicio de sesión.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Ir al inicio de sesión
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nueva contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Actualizando..." : "Actualizar contraseña"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default UpdatePassword;
