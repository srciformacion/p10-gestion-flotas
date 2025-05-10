import React from 'react';
import { Navbar } from "@/components/Navbar";
import { LandingHero } from "@/components/LandingHero";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/auth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Bienvenido a Gestión de Usuarios y Flotas
        </h1>
        <p className="text-muted-foreground">
          La solución integral para la gestión eficiente de traslados sanitarios.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
          <Link to="/registro">
            <Button variant="outline">Crear Cuenta</Button>
          </Link>
          <Link to="/demo-accounts">
            <Button variant="secondary">Probar Usuarios Demo</Button>
          </Link>
          <Link to="/demo">
            <Button variant="outline">Ver Demostración</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
