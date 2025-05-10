
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { LandingHero } from "@/components/LandingHero";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/auth";

const Index = () => {
  const { simulateDemoLogin } = useAuth();

  const handleDemoLogin = async () => {
    await simulateDemoLogin("admin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar variant="transparent" />
      
      <main className="flex-grow">
        <div className="relative bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-corporate-green/10 to-corporate-gray/10 z-0"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h1 className="text-4xl font-bold tracking-tight text-corporate-gray-dark sm:text-5xl md:text-6xl">
                  <span className="block text-corporate-green">AmbulLink</span>
                  <span className="block">Gestión de Traslados Sanitarios</span>
                </h1>
                <p className="mt-6 text-xl text-gray-500 max-w-3xl">
                  Plataforma integral para la gestión eficiente de traslados sanitarios, conectando hospitales, pacientes y flotas de ambulancias.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="w-full sm:w-auto" asChild>
                    <Link to="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto" asChild>
                    <Link to="/registro">Crear Cuenta</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={handleDemoLogin}>
                    Acceso Demo
                  </Button>
                </div>
              </div>
              
              <div className="hidden md:block">
                <img 
                  src="/placeholder.svg" 
                  alt="AmbulLink Dashboard" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-corporate-gray-dark">Funcionalidades principales</h2>
              <p className="mt-4 text-lg text-gray-500">
                Soluciones diseñadas para optimizar la gestión de traslados sanitarios
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="bg-corporate-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-corporate-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-corporate-gray-dark">Gestión de solicitudes</h3>
                <p className="mt-2 text-gray-500">Control completo de todas las solicitudes de traslado en tiempo real.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="bg-corporate-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-corporate-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-corporate-gray-dark">Seguimiento GPS</h3>
                <p className="mt-2 text-gray-500">Monitorización en tiempo real de la ubicación de cada vehículo.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="bg-corporate-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-corporate-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-corporate-gray-dark">Informes y estadísticas</h3>
                <p className="mt-2 text-gray-500">Análisis detallado del rendimiento y los tiempos de respuesta.</p>
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
