
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, Calendar, Activity } from "lucide-react";

const Index = () => {
  // Lista optimizada de cuentas de prueba con más variedad
  const testAccounts = [
    {
      label: "Administrador",
      email: "admin@ambulancias.com",
      description: "Acceso completo al sistema",
      icon: "👨‍💼"
    }, 
    {
      label: "Centro Coordinador",
      email: "coordinador@ambulancias.com", 
      description: "Gestión de solicitudes y rutas",
      icon: "📋"
    },
    {
      label: "Hospital General",
      email: "hospital@salud.com",
      description: "Solicitudes desde centro médico",
      icon: "🏥"
    },
    {
      label: "Ambulancia AMB-001",
      email: "ambulancia1@madrid.com",
      description: "Conductor y equipo médico",
      icon: "🚑"
    },
    {
      label: "Usuario Particular",
      email: "usuario1@gmail.com",
      description: "Solicitudes individuales",
      icon: "👤"
    },
    {
      label: "Emergencias 112",
      email: "emergencias@112.es",
      description: "Servicios de emergencia",
      icon: "🚨"
    }
  ];

  const systemStats = [
    { label: "Usuarios Activos", value: "10", icon: Users },
    { label: "Solicitudes Hoy", value: "47", icon: Calendar },
    { label: "Ambulancias", value: "5", icon: Truck },
    { label: "Servicios Activos", value: "8", icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Sistema de Gestión de Transporte Sanitario
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Plataforma integral para la coordinación de ambulancias y servicios médicos
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Estadísticas del sistema */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {systemStats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg text-center">
                  <stat.icon className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center space-y-6">
              <Link to="/login" className="block w-full max-w-md">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:shadow-xl" size="lg">
                  Iniciar Sesión
                </Button>
              </Link>
              
              <div className="text-center">
                <span className="text-gray-500">¿No tienes cuenta? </span>
                <Link to="/registro" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                  Regístrate aquí
                </Link>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-center text-gray-500 mb-4 font-medium">
                🔧 Acceso de Prueba - Contraseña: 123456
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
                {testAccounts.map(account => (
                  <Link 
                    key={account.email} 
                    to="/login" 
                    state={{ email: account.email }} 
                    className="block"
                  >
                    <Button 
                      variant="outline" 
                      className="w-full justify-start p-4 h-auto border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors" 
                      size="sm"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{account.icon}</span>
                        <div className="text-left">
                          <div className="font-medium text-gray-700">{account.label}</div>
                          <div className="text-xs text-gray-500">{account.description}</div>
                          <div className="text-xs text-blue-500 font-mono">{account.email}</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-400">
                  💡 Sistema de demostración con datos simulados para testing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
