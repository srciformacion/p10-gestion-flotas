
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
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <header className={cn(
      "border-b z-50 sticky top-0 shadow-sm",
      variant === "transparent" ? "bg-transparent border-transparent" : "bg-secondary text-white" // Texto blanco explícito sobre fondo oscuro
    )}>
      <div className="container flex h-16 items-center px-4 md:px-6">
        {user && <SidebarTrigger className="mr-4 md:hidden text-white" />}
        
        <Link to="/" className="mr-6">
          <Logo />
        </Link>
        
        <div className="ml-auto flex items-center gap-3">
          {user && <NotificationBell />}
          {user && <UserMenu user={user} logout={logout} />}
          {!user && location.pathname !== "/" && (
            <Link to="/login">
              <Button variant="outline" className={cn(variant === "default" ? "border-white text-white hover:bg-white/10" : "")}>
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
