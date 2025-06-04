
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

const Index = () => {
  // Cuentas de prueba para facilitar el acceso
  const testAccounts = [
    { label: "Administrador", email: "admin@ambulink.com" },
    { label: "Centro sanitario", email: "hospital@ambulink.com" },
    { label: "Usuario particular", email: "usuario@ambulink.com" },
    { label: "Empresa de ambulancias", email: "ambulancia@ambulink.com" },
    { label: "Ambulancia", email: "equipo@ambulink.com" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
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
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <Link to="/login">
                <Button className="w-full bg-rioja-green hover:bg-rioja-green/90 text-white py-3">
                  Acceder al sistema
                </Button>
              </Link>
              
              <div className="text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Link to="/registro" className="text-rioja-green hover:underline font-medium">
                  Crear cuenta
                </Link>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-xs text-center text-gray-500 mb-4">
                Cuentas de prueba (usar contraseña: 123456)
              </p>
              
              <div className="grid grid-cols-1 gap-2">
                {testAccounts.map((account) => (
                  <Link
                    key={account.email}
                    to="/login"
                    state={{ email: account.email }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left py-3 border-gray-300 hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{account.label}</span>
                      <span className="text-gray-400">→</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
