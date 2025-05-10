
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { LandingHero } from "@/components/LandingHero";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/auth";
import { ArrowRight, CheckCircle, Ambulance, Activity, Calendar, Users } from "lucide-react";

const Index = () => {
  const { simulateDemoLogin } = useAuth();

  const handleDemoLogin = async () => {
    await simulateDemoLogin("admin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar variant="transparent" />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-[#78BE20]/10 to-[#3D4952]/10 z-0"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h1 className="text-4xl font-bold tracking-tight text-[#3D4952] sm:text-5xl md:text-6xl">
                  <span className="block text-[#78BE20]">AmbulLink</span>
                  <span className="block">Gestión de Traslados Sanitarios</span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-3xl">
                  Plataforma integral para la gestión eficiente de traslados sanitarios, conectando hospitales, pacientes y servicios de ambulancias en un solo sistema.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="w-full sm:w-auto bg-[#78BE20] hover:bg-[#62A01A]" asChild>
                    <Link to="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#78BE20] text-[#78BE20] hover:bg-[#78BE20]/10" asChild>
                    <Link to="/registro">Crear Cuenta</Link>
                  </Button>
                  <Button size="lg" variant="ghost" className="w-full sm:w-auto" onClick={handleDemoLogin}>
                    Explorar como demo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="hidden md:block">
                <img 
                  src="/placeholder.svg" 
                  alt="AmbulLink Dashboard" 
                  className="rounded-lg shadow-xl border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#3D4952]">Funcionalidades principales</h2>
              <p className="mt-4 text-lg text-gray-600">
                Soluciones diseñadas para optimizar la gestión de traslados sanitarios
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-[#78BE20]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-[#78BE20]" />
                </div>
                <h3 className="text-lg font-medium text-[#3D4952]">Gestión de solicitudes</h3>
                <p className="mt-2 text-gray-600">Control completo de todas las solicitudes de traslado en tiempo real.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-[#78BE20]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Ambulance className="w-6 h-6 text-[#78BE20]" />
                </div>
                <h3 className="text-lg font-medium text-[#3D4952]">Seguimiento GPS</h3>
                <p className="mt-2 text-gray-600">Monitorización en tiempo real de la ubicación de cada vehículo.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="bg-[#78BE20]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-[#78BE20]" />
                </div>
                <h3 className="text-lg font-medium text-[#3D4952]">Informes y estadísticas</h3>
                <p className="mt-2 text-gray-600">Análisis detallado del rendimiento y los tiempos de respuesta.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials or additional features section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="bg-[#3D4952]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-[#3D4952]" />
                </div>
                <h3 className="text-xl font-medium text-[#3D4952] mb-2">Programación eficiente</h3>
                <p className="text-gray-600">Programa traslados únicos o recurrentes con facilidad.</p>
              </div>
              
              <div className="p-6 flex flex-col items-center text-center">
                <div className="bg-[#3D4952]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-[#3D4952]" />
                </div>
                <h3 className="text-xl font-medium text-[#3D4952] mb-2">Múltiples usuarios</h3>
                <p className="text-gray-600">Diferentes niveles de acceso según el rol del usuario.</p>
              </div>
              
              <div className="p-6 flex flex-col items-center text-center">
                <div className="bg-[#3D4952]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Ambulance className="w-8 h-8 text-[#3D4952]" />
                </div>
                <h3 className="text-xl font-medium text-[#3D4952] mb-2">Gestión de flota</h3>
                <p className="text-gray-600">Administra todos tus vehículos desde una sola plataforma.</p>
              </div>
              
              <div className="p-6 flex flex-col items-center text-center">
                <div className="bg-[#3D4952]/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-[#3D4952]" />
                </div>
                <h3 className="text-xl font-medium text-[#3D4952] mb-2">Informes en tiempo real</h3>
                <p className="text-gray-600">Analiza el rendimiento de tus operaciones en directo.</p>
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
