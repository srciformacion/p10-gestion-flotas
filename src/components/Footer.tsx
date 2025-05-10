
import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Logo minimal={true} />
            <span className="text-sm text-gray-500">
              © {currentYear} AmbulLink
            </span>
          </div>
          
          <div className="flex space-x-4 text-sm">
            <Link to="/demo-accounts" className="text-gray-600 hover:text-primary">
              Cuentas demo
            </Link>
            <a href="#" className="text-gray-600 hover:text-primary">
              Soporte
            </a>
            <a href="#" className="text-gray-600 hover:text-primary">
              Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
