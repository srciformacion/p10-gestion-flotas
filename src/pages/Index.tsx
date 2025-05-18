
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, LogIn, TestTubeDiagonal } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

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
            <div className="space-y-4">
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
              
              <Button 
                variant="outline"
                className="w-full h-12 text-base justify-between font-medium border-primary/50 hover:bg-primary/10 hover:text-primary text-gray-700"
                onClick={() => navigate("/demo-accounts")}
              >
                <span className="flex items-center">
                  <TestTubeDiagonal className="h-5 w-5 mr-3" />
                  Probar cuentas de demostración
                </span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
