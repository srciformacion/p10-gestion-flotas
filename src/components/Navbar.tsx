import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Logo } from '../Logo';
import { UserMenu } from './navbar/UserMenu';
import { AuthButtons } from './navbar/AuthButtons';
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface NavbarProps {
  variant?: "default" | "transparent";
}

interface DesktopNavigationProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const DesktopNavigation = ({ user }: DesktopNavigationProps) => {
  const pathname = usePathname();
  const isAdmin = user.role === 'admin';
  
  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', show: true },
    { label: 'Solicitud', href: '/solicitud', show: true },
    { label: 'Solicitudes', href: '/solicitudes', show: true },
    { label: 'Mensajes', href: '/mensajes', show: true },
    { label: 'Admin', href: '/admin/dashboard', show: isAdmin },
  ];

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {navigationItems.map((item) => (
          item.show && (
            <NavigationMenuItem key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary hover:text-accent-foreground h-9 px-4 py-2",
                  pathname === item.href ? "bg-secondary text-accent-foreground" : ""
                )}
              >
                {item.label}
              </Link>
            </NavigationMenuItem>
          )
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

interface MobileMenuProps {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const MobileMenu = ({ user }: MobileMenuProps) => {
  const pathname = usePathname();
  const isAdmin = user.role === 'admin';
  
  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', show: true },
    { label: 'Solicitud', href: '/solicitud', show: true },
    { label: 'Solicitudes', href: '/solicitudes', show: true },
    { label: 'Mensajes', href: '/mensajes', show: true },
    { label: 'Admin', href: '/admin/dashboard', show: isAdmin },
  ];
  
  return (
    <Sheet>
      <SheetTrigger className="ml-auto md:hidden">
        <Button variant="ghost" size="sm">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Menú</SheetTitle>
          <SheetDescription>
            Navega por las opciones disponibles.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {navigationItems.map((item) => (
            item.show && (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="w-full justify-start" active={pathname === item.href}>
                  {item.label}
                </Button>
              </Link>
            )
          ))}
          <Link href="/perfil">
            <Button variant="ghost" className="w-full justify-start" active={pathname === '/perfil'}>
              Perfil
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export const Navbar = ({ variant = "default" }: NavbarProps) => {
  const { user } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <header className={cn(
      "border-b bg-background z-50 sticky top-0",
      variant === "transparent" && "bg-transparent border-transparent absolute"
    )}>
      <div className="container flex items-center h-16 px-4 md:px-6">
        <Link href="/" className="mr-6">
          <Logo />
        </Link>
        
        {user && <DesktopNavigation user={user} />}
        
        <div className="ml-auto flex items-center gap-2">
          {/* Agregamos el NotificationBell aquí */}
          {user && <NotificationBell />}
          {user && <UserMenu user={user} />}
          {!user && <AuthButtons transparent={variant === "transparent"} />}
        </div>
        
        {/* Mobile menu */}
        {user && <MobileMenu user={user} />}
      </div>
    </header>
  );
};

