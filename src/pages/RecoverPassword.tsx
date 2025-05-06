
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Usar Supabase para enviar el correo de recuperación
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/actualizar-password`,
      });
      
      if (error) throw error;
      
      setIsSuccess(true);
      toast.success("Correo enviado", {
        description: "Revisa tu bandeja de entrada para recuperar tu contraseña",
      });
    } catch (error: any) {
      console.error("Error al enviar el correo de recuperación:", error);
      setError(error.message || "No se pudo enviar el correo de recuperación");
      toast.error("Error", {
        description: error.message || "No se pudo enviar el correo de recuperación",
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
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2"
                onClick={() => navigate('/login')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-2xl">Recuperar contraseña</CardTitle>
            </div>
            <CardDescription>
              {isSuccess 
                ? "Te hemos enviado un correo con instrucciones para recuperar tu contraseña" 
                : "Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Revisa tu bandeja de entrada y sigue las instrucciones para recuperar tu contraseña.
                    Si no encuentras el correo, revisa tu carpeta de spam.
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Volver al inicio de sesión
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
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Enviando..." : "Enviar instrucciones"}
                </Button>
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RecoverPassword;
