
import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/auth";
import { ArrowRight, LogIn, UserRound } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const { simulateDemoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (role: "admin" | "hospital" | "individual" | "ambulance") => {
    try {
      toast.info(`Iniciando sesión como ${role}...`);
      await simulateDemoLogin(role);
      
      // Redirección según el rol
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "individual") {
        navigate("/solicitudes", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Error en la demostración:", error);
      toast.error("No se pudo iniciar la sesión de demostración");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar variant="transparent" />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AmbulLink</h1>
            <p className="text-gray-600">
              Gestión de traslados sanitarios
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
            <div className="space-y-6">
              <Button 
                className="w-full h-12 text-base justify-between font-medium"
                onClick={() => navigate("/login")}
              >
                <span className="flex items-center">
                  <LogIn className="h-5 w-5 mr-3" />
                  Ingresar con tu cuenta
                </span>
                <ArrowRight className="h-5 w-5" />
              </Button>
              
              <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-sm text-gray-500">o accede con una cuenta demo</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("admin")}
                  className="h-12 border-[#78BE20]/50 hover:bg-[#78BE20]/10 hover:text-[#78BE20] text-gray-700"
                >
                  <UserRound className="h-4 w-4 mr-2" />
                  Administrador
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("hospital")}
                  className="h-12 border-[#78BE20]/50 hover:bg-[#78BE20]/10 hover:text-[#78BE20] text-gray-700"
                >
                  <UserRound className="h-4 w-4 mr-2" />
                  Centro médico
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("individual")}
                  className="h-12 border-[#78BE20]/50 hover:bg-[#78BE20]/10 hover:text-[#78BE20] text-gray-700"
                >
                  <UserRound className="h-4 w-4 mr-2" />
                  Paciente
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin("ambulance")}
                  className="h-12 border-[#78BE20]/50 hover:bg-[#78BE20]/10 hover:text-[#78BE20] text-gray-700"
                >
                  <UserRound className="h-4 w-4 mr-2" />
                  Ambulancias
                </Button>
              </div>

              <div className="text-center mt-4">
                <Link to="/demo-accounts" className="text-sm text-primary hover:underline">
                  Ver todas las cuentas de demostración
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
