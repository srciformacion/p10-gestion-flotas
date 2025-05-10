
import React from 'react';
import { Navbar } from "@/components/Navbar";
import { LandingHero } from "@/components/LandingHero";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/auth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar variant="transparent" />
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Bienvenido a Gestión de Usuarios y Flotas
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            La solución integral para la gestión eficiente de traslados sanitarios.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login">
              <Button size="lg">Iniciar Sesión</Button>
            </Link>
            <Link to="/registro">
              <Button variant="outline" size="lg">Crear Cuenta</Button>
            </Link>
            <Link to="/demo-accounts">
              <Button variant="secondary" size="lg">Probar Usuarios Demo</Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg">Ver Demostración</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
