
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
  const showAdminLink = user && (user.role === 'admin' || user.role === 'ambulance');

  return (
    <nav className="bg-rioja-blue dark:bg-rioja-blue border-b border-rioja-blue/20 sticky top-0 z-50 shadow-sm">
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
                    <Link to="/dashboard" className="text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                      Dashboard
                    </Link>
                  )}
                  
                  {(user.role === 'hospital' || user.role === 'individual') && (
                    <Link to="/nueva-solicitud" className="text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                      Nueva Solicitud
                    </Link>
                  )}
                  
                  <Link to="/solicitudes" className="text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    Mis Solicitudes
                  </Link>
                  
                  {showAdminLink && (
                    <Link to="/admin" className="text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                      Administración
                    </Link>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-rioja-green focus:ring-offset-2 focus:ring-offset-rioja-blue rounded-full">
                    <Avatar className="h-8 w-8 bg-rioja-green text-rioja-white cursor-pointer ring-2 ring-rioja-green/20 hover:ring-rioja-green/40 transition-all duration-200">
                      <AvatarFallback className="bg-rioja-green text-rioja-white font-semibold">{user ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <DropdownMenuLabel className="text-rioja-blue font-semibold">{user.name}</DropdownMenuLabel>
                    <DropdownMenuLabel className="text-xs text-gray-600 dark:text-gray-400">{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="text-gray-700 dark:text-gray-200 hover:bg-rioja-green/10 hover:text-rioja-blue focus:bg-rioja-green/10 focus:text-rioja-blue cursor-pointer">
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 hover:bg-red-50 focus:bg-red-50 cursor-pointer" onClick={logout}>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="mr-2 bg-transparent border-rioja-white text-rioja-white hover:bg-rioja-white hover:text-rioja-blue">Iniciar Sesión</Button>
                </Link>
                <Link to="/registro">
                  <Button className="bg-rioja-green text-rioja-white hover:bg-rioja-green/90">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 focus:outline-none focus:ring-2 focus:ring-rioja-green focus:ring-offset-2 focus:ring-offset-rioja-blue transition-colors duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-rioja-blue border-t border-rioja-blue/30">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {user ? (
              <>
                {showDashboardLink && (
                  <Link
                    to="/dashboard"
                    className="block text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                )}
                
                {(user.role === 'hospital' || user.role === 'individual') && (
                  <Link
                    to="/nueva-solicitud"
                    className="block text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    Nueva Solicitud
                  </Link>
                )}
                
                <Link
                  to="/solicitudes"
                  className="block text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Mis Solicitudes
                </Link>
                
                {showAdminLink && (
                  <Link
                    to="/admin"
                    className="block text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={closeMenu}
                  >
                    Administración
                  </Link>
                )}
                
                <Link
                  to="/perfil"
                  className="block text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Mi Perfil
                </Link>
                
                <button
                  className="w-full text-left text-red-300 hover:text-red-200 hover:bg-red-500/20 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
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
                  className="block text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="block text-rioja-white/90 hover:text-rioja-green hover:bg-rioja-green/10 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
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
