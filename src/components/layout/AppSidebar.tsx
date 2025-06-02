
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  Ambulance, 
  FileText, 
  MessageSquare, 
  Settings,
  MapPin,
  Calendar,
  BarChart3,
  Route,
  Zap
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ['admin', 'centroCoordinador', 'hospital', 'equipoMovil']
  },
  {
    title: "Solicitudes",
    url: "/solicitudes",
    icon: FileText,
    roles: ['admin', 'centroCoordinador', 'hospital', 'individual', 'equipoMovil']
  },
  {
    title: "Ambulancias",
    url: "/ambulancias",
    icon: Ambulance,
    roles: ['admin', 'centroCoordinador']
  },
  {
    title: "Usuarios",
    url: "/usuarios",
    icon: Users,
    roles: ['admin']
  },
  {
    title: "Rutas",
    url: "/rutas",
    icon: Route,
    roles: ['admin', 'centroCoordinador', 'equipoMovil']
  },
  {
    title: "Seguimiento",
    url: "/seguimiento",
    icon: MapPin,
    roles: ['admin', 'centroCoordinador', 'hospital']
  },
  {
    title: "Despacho IA",
    url: "/despacho",
    icon: Zap,
    roles: ['admin', 'centroCoordinador']
  },
  {
    title: "Analíticas",
    url: "/analiticas",
    icon: BarChart3,
    roles: ['admin', 'centroCoordinador']
  },
  {
    title: "Mensajes",
    url: "/mensajes",
    icon: MessageSquare,
    roles: ['admin', 'centroCoordinador', 'hospital', 'individual', 'equipoMovil']
  },
  {
    title: "Configuración",
    url: "/configuracion",
    icon: Settings,
    roles: ['admin', 'centroCoordinador']
  }
];

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  if (!user) return null;

  const allowedItems = navigationItems.filter(item => 
    item.roles.includes(user.role)
  );

  const isActive = (path: string) => currentPath === path;
  const getNavCls = (isActive: boolean) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible>
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Navegación Principal"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {allowedItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavCls(isActive)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
