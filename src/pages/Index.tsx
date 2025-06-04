
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

const Index = () => {
  // Lista optimizada de cuentas de prueba
  const testAccounts = [
    { label: "Administrador", email: "admin@ambulink.com" },
    { label: "Centro sanitario", email: "hospital@ambulink.com" },
    { label: "Usuario particular", email: "usuario@ambulink.com" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900">
                AmbulLink
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Sistema de gestión de transporte sanitario
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Link to="/login" className="block">
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                size="lg"
              >
                Iniciar Sesión
              </Button>
            </Link>
            
            <div className="text-center">
              <span className="text-gray-500">¿No tienes cuenta? </span>
              <Link to="/registro" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                Regístrate aquí
              </Link>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-center text-gray-500 mb-4 font-medium">
                Acceso rápido - Contraseña: 123456
              </p>
              
              <div className="space-y-2">
                {testAccounts.map((account) => (
                  <Link
                    key={account.email}
                    to="/login"
                    state={{ email: account.email }}
                    className="block"
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-between py-3 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                      size="sm"
                    >
                      <span className="text-gray-700 font-medium">{account.label}</span>
                      <span className="text-blue-500">→</span>
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
