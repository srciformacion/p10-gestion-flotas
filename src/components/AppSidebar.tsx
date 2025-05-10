
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { 
  Home, 
  Ambulance, 
  Calendar, 
  FileText, 
  Users, 
  Settings, 
  MessageSquare, 
  User,
  BarChart,
  Building,
  LogOut,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarNavItemType {
  title: string;
  href: string;
  icon: typeof Home;
  roles: string[];
}

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  if (!user) return null;
  
  const isAdmin = user.role === 'admin';
  const isAmbulance = user.role === 'ambulance';
  const isHospital = user.role === 'hospital';
  const isIndividual = user.role === 'individual';
  
  const mainNavItems: SidebarNavItemType[] = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ['admin', 'ambulance', 'hospital'],
    },
    {
      title: "Nueva Solicitud",
      href: "/solicitud",
      icon: Calendar,
      roles: ['hospital', 'individual'],
    },
    {
      title: "Solicitud Avanzada",
      href: "/solicitud-avanzada",
      icon: FileText,
      roles: ['hospital', 'admin'],
    },
    {
      title: "Mis Solicitudes",
      href: "/solicitudes",
      icon: FileText,
      roles: ['admin', 'ambulance', 'hospital', 'individual'],
    },
    {
      title: "Mensajes",
      href: "/mensajes",
      icon: MessageSquare,
      roles: ['admin', 'ambulance', 'hospital', 'individual'],
    },
    {
      title: "Vehículos",
      href: "/vehiculos",
      icon: Ambulance,
      roles: ['ambulance'],
    },
    {
      title: "Seguimiento GPS",
      href: "/seguimiento",
      icon: MapPin,
      roles: ['admin', 'ambulance'],
    },
  ];
  
  const adminNavItems: SidebarNavItemType[] = [
    {
      title: "Panel Admin",
      href: "/admin/dashboard",
      icon: Settings,
      roles: ['admin', 'ambulance'],
    },
    {
      title: "Empresas",
      href: "/admin/empresas",
      icon: Building,
      roles: ['admin'],
    },
    {
      title: "Usuarios",
      href: "/admin/usuarios",
      icon: Users,
      roles: ['admin'],
    },
    {
      title: "Vehículos",
      href: "/admin/vehiculos",
      icon: Ambulance,
      roles: ['admin'],
    },
    {
      title: "Estadísticas",
      href: "/admin/bi",
      icon: BarChart,
      roles: ['admin'],
    }
  ];
  
  // Filter nav items based on user role
  const filteredMainItems = mainNavItems.filter(
    item => item.roles.includes(user.role)
  );
  
  const filteredAdminItems = adminNavItems.filter(
    item => item.roles.includes(user.role)
  );
  
  const isLinkActive = (href: string) => {
    if (href === '/dashboard' && currentPath === '/dashboard') {
      return true;
    }
    
    if (href !== '/dashboard' && currentPath.startsWith(href)) {
      return true;
    }
    
    return false;
  };
  
  return (
    <Sidebar className="border-r w-64" collapsible="offcanvas">
      <SidebarHeader className="p-4">
        <Logo />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isLinkActive(item.href)}
                  >
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center",
                        isLinkActive(item.href) && "bg-accent text-accent-foreground"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {filteredAdminItems.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Administración</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredAdminItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isLinkActive(item.href)}
                      >
                        <Link
                          to={item.href}
                          className={cn(
                            "flex items-center",
                            isLinkActive(item.href) && "bg-accent text-accent-foreground"
                          )}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex flex-col space-y-2">
          <Link to="/perfil" className="w-full">
            <Button 
              variant="outline" 
              className="w-full justify-start"
            >
              <User className="mr-2 h-4 w-4" />
              Mi Perfil
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
