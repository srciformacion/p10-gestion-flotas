
import React from "react";
import { Link } from "react-router-dom";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface DesktopNavigationProps {
  user: User | null;
  logout: () => void;
  showDashboardLink: boolean;
  showAdvancedRequestLink: boolean;
}

export const DesktopNavigation = React.memo(({
  user,
  logout,
  showDashboardLink,
  showAdvancedRequestLink
}: DesktopNavigationProps) => {
  return (
    <div className="hidden md:flex items-center">
      {user ? (
        <>
          <div className="flex items-center space-x-4 mr-4">
            {showDashboardLink && (
              <Link to="/dashboard" className="text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
            )}
            
            {(user.role === 'hospital' || user.role === 'individual') && (
              <Link to="/solicitud" className="text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-sm font-medium">
                Nueva Solicitud
              </Link>
            )}
            
            {showAdvancedRequestLink && (
              <Link to="/solicitud-avanzada" className="text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-sm font-medium">
                Solicitud Avanzada
              </Link>
            )}
            
            <Link to="/solicitudes" className="text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-sm font-medium">
              Mis Solicitudes
            </Link>
            
            {user.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-sm font-medium">
                Administración
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <NotificationBell />
            <UserMenu user={user} logout={logout} />
          </div>
        </>
      ) : (
        <>
          <Link to="/login">
            <Button variant="outline" className="mr-2">Iniciar Sesión</Button>
          </Link>
          <Link to="/registro">
            <Button>Registrarse</Button>
          </Link>
        </>
      )}
    </div>
  );
});

DesktopNavigation.displayName = "DesktopNavigation";
