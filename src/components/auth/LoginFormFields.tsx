
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onTestConnection: () => void;
}

export const LoginFormFields = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  isLoading, 
  onSubmit,
  onTestConnection
}: LoginFormFieldsProps) => {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              to="/recuperar-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>
      
      <Button 
        variant="outline" 
        className="w-full mt-2"
        onClick={onTestConnection}
        disabled={isLoading}
      >
        {isLoading ? "Probando..." : "Diagnosticar conexión"}
      </Button>

      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link to="/registro" className="font-medium text-primary-blue hover:underline">
          Crear cuenta
        </Link>
      </div>
    </>
  );
};
