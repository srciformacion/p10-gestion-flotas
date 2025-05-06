
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authApi } from "@/services/api/auth";
import { toast } from "@/components/ui/sonner";

interface DemoAccount {
  email: string;
  password: string;
  role: string;
  description: string;
}

const DemoAccounts = () => {
  const navigate = useNavigate();

  const demoAccounts: DemoAccount[] = [
    {
      email: "admin@ambulink.com",
      password: "123456",
      role: "Administrador",
      description: "Acceso completo a todas las funciones del sistema, gestión de usuarios y empresas."
    },
    {
      email: "hospital@ambulink.com",
      password: "123456",
      role: "Centro sanitario",
      description: "Solicitud de traslados sanitarios y seguimiento en tiempo real."
    },
    {
      email: "usuario@ambulink.com",
      password: "123456",
      role: "Usuario particular",
      description: "Solicitud básica de traslados y seguimiento de estado."
    },
    {
      email: "ambulancia@ambulink.com",
      password: "123456",
      role: "Empresa de ambulancias", 
      description: "Gestión de flota de vehículos y asignación de traslados."
    }
  ];

  const loginWithAccount = async (account: DemoAccount) => {
    try {
      toast.info(`Iniciando sesión como ${account.role}...`);
      await authApi.login(account.email, account.password);
      toast.success(`Sesión iniciada como ${account.role}`, {
        description: "Redirigiendo al panel de control..."
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión", {
        description: "Por favor, intenta nuevamente más tarde."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">AmbulLink Demo</h1>
        </div>
      </header>
      
      <main className="flex-grow p-4 md:p-6 container mx-auto max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cuentas de demostración</CardTitle>
            <CardDescription>
              Selecciona un tipo de usuario para probar las diferentes funcionalidades del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-gray-500">
              Para fines de demostración, todas las cuentas utilizan la contraseña: <strong>123456</strong>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demoAccounts.map((account) => (
                <Card key={account.email} className="overflow-hidden border-2 hover:border-primary transition-colors">
                  <CardHeader className="bg-gray-50 pb-3">
                    <CardTitle className="text-lg">{account.role}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 mb-4">{account.description}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      <strong>Email:</strong> {account.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      <strong>Contraseña:</strong> {account.password}
                    </p>
                  </CardContent>
                  <CardFooter className="bg-gray-50 pt-3">
                    <Button 
                      className="w-full" 
                      onClick={() => loginWithAccount(account)}
                    >
                      Iniciar sesión como {account.role}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button variant="outline" onClick={() => navigate("/")}>
              Volver al inicio
            </Button>
            <Button variant="outline" onClick={() => navigate("/demo")}>
              Ver demo sin iniciar sesión
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default DemoAccounts;
