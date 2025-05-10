
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { 
  LayoutDashboard, 
  FileText, 
  Ambulance, 
  MapPin, 
  Users, 
  Settings,
  Building, 
  PlusCircle
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed?: boolean;
  end?: boolean;
}

const NavItem = ({ to, icon: Icon, label, collapsed = false, end = false }: NavItemProps) => {
  const location = useLocation();
  const isActive = end 
    ? location.pathname === to 
    : location.pathname.startsWith(to);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
      >
        <NavLink 
          to={to} 
          className={cn(
            "flex items-center gap-2 w-full",
            isActive ? "font-medium" : "text-muted-foreground"
          )}
        >
          <Icon className="w-5 h-5" />
          {!collapsed && <span>{label}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

interface MainNavigationProps {
  collapsed?: boolean;
}

export const MainNavigation = ({ collapsed = false }: MainNavigationProps) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const isAdmin = user.role === "admin";
  const isAmbulance = user.role === "ambulance";
  const isHospital = user.role === "hospital";
  const isIndividual = user.role === "individual";
  const canCreateRequest = isHospital || isIndividual;

  return (
    <div className="flex flex-col gap-1">
      <NavItem to="/dashboard" icon={LayoutDashboard} label="Panel principal" collapsed={collapsed} end />
      
      {canCreateRequest && (
        <NavItem to="/solicitud" icon={PlusCircle} label="Nueva solicitud" collapsed={collapsed} />
      )}
      
      <NavItem to="/solicitudes" icon={FileText} label="Solicitudes" collapsed={collapsed} />
      
      {isAmbulance && (
        <NavItem to="/ambulance-tracking" icon={MapPin} label="Seguimiento" collapsed={collapsed} />
      )}
      
      {isAdmin && (
        <>
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Panel admin" collapsed={collapsed} />
          <NavItem to="/admin/empresas" icon={Building} label="Empresas" collapsed={collapsed} />
          <NavItem to="/admin/usuarios" icon={Users} label="Usuarios" collapsed={collapsed} />
          <NavItem to="/admin/solicitudes" icon={FileText} label="Solicitudes" collapsed={collapsed} />
          <NavItem to="/admin/vehiculos" icon={Ambulance} label="Vehículos" collapsed={collapsed} />
          <NavItem to="/admin/tracking" icon={MapPin} label="Seguimiento GPS" collapsed={collapsed} />
          <NavItem to="/admin/configuracion" icon={Settings} label="Configuración" collapsed={collapsed} />
        </>
      )}
    </div>
  );
};
