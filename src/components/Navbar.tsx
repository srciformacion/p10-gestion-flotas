
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { 
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Logo } from './Logo';
import { UserMenu } from './navbar/UserMenu';
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface NavbarProps {
  variant?: "default" | "transparent";
}

export const Navbar = ({ variant = "default" }: NavbarProps) => {
  const { user, logout, simulateDemoLogin } = useAuth();
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  
  const handleDemoLogin = async () => {
    await simulateDemoLogin("admin");
  };
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <header className={cn(
      "border-b bg-background z-50 sticky top-0 shadow-sm",
      variant === "transparent" && "bg-transparent border-transparent absolute"
    )}>
      <div className="container flex h-16 items-center px-4 md:px-6">
        {user && <SidebarTrigger className="mr-4 md:hidden" />}
        
        {!user && (
          <Link to="/" className="mr-6">
            <Logo />
          </Link>
        )}
        
        <div className="hidden md:flex items-center space-x-4 ml-auto">
          {!user && location.pathname !== "/" && (
            <Link to="/" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Inicio
            </Link>
          )}
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          {user && <NotificationBell />}
          {user && <UserMenu user={user} logout={logout} />}
          {!user && (
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleDemoLogin} className="hidden sm:flex">
                Acceso Demo
              </Button>
              <Link to="/login">
                <Button variant="outline">Iniciar Sesión</Button>
              </Link>
              <Link to="/registro">
                <Button>Registrarse</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
