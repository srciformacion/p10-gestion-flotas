
import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              AmbulLink es la plataforma integral para la gestión de traslados sanitarios, conectando centros médicos con servicios de ambulancias.
            </p>
            <p className="text-sm text-gray-500">
              © {currentYear} AmbulLink. Todos los derechos reservados.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/solicitudes" className="text-gray-600 hover:text-primary">
                  Solicitudes
                </Link>
              </li>
              <li>
                <Link to="/solicitud" className="text-gray-600 hover:text-primary">
                  Nueva solicitud
                </Link>
              </li>
              <li>
                <Link to="/perfil" className="text-gray-600 hover:text-primary">
                  Mi perfil
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/demo-accounts" className="text-gray-600 hover:text-primary">
                  Cuentas de demostración
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">
                  Documentación
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">
                  Soporte técnico
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary">
                  Política de privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
