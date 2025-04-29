
import { Link } from "react-router-dom";
import { User } from "@/types";

interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  closeMenu: () => void;
  logout: () => void;
  showDashboardLink: boolean;
  showAdvancedRequestLink: boolean;
}

export const MobileMenu = ({
  isOpen,
  user,
  closeMenu,
  logout,
  showDashboardLink,
  showAdvancedRequestLink
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="space-y-1 px-2 pb-3 pt-2">
        {user ? (
          <>
            {showDashboardLink && (
              <Link
                to="/dashboard"
                className="block text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-base font-medium"
                onClick={closeMenu}
              >
                Dashboard
              </Link>
            )}
            
            {(user.role === 'hospital' || user.role === 'individual') && (
              <Link
                to="/solicitud"
                className="block text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-base font-medium"
                onClick={closeMenu}
              >
                Nueva Solicitud
              </Link>
            )}
            
            {showAdvancedRequestLink && (
              <Link
                to="/solicitud-avanzada"
                className="block text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-base font-medium"
                onClick={closeMenu}
              >
                Solicitud Avanzada
              </Link>
            )}
            
            <Link
              to="/solicitudes"
              className="block text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Mis Solicitudes
            </Link>
            
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="block text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-base font-medium"
                onClick={closeMenu}
              >
                Administración
              </Link>
            )}
            
            <Link
              to="/perfil"
              className="block text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Mi Perfil
            </Link>
            
            <button
              className="w-full text-left text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="block text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/registro"
              className="block text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
