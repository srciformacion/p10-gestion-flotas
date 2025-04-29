
import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const showDashboardLink = user && user.role !== 'individual';

  return (
    <nav className="bg-white dark:bg-gray-900 border-b sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
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
                  
                  <Link to="/solicitudes" className="text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-sm font-medium">
                    Mis Solicitudes
                  </Link>
                  
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-gray-600 hover:text-primary-blue-dark px-3 py-2 rounded-md text-sm font-medium">
                      Administración
                    </Link>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar className="h-8 w-8 bg-primary-blue text-white cursor-pointer">
                      <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs text-gray-500">{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/perfil">Mi Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={logout}>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
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
      )}
    </nav>
  );
};
