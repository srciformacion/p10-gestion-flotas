
import { useLocation, Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Ambulance, 
  Settings, 
  User,
  MessageSquare,
  Bell,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth";

export const MainNavigation = ({ collapsed }: { collapsed: boolean }) => {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // No render if no user
  if (!user) return null;
  
  // Generate path checking function
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Role-based access control for menu items
  const isAdmin = user.role === 'admin';
  const isHospital = user.role === 'hospital';
  const isIndividual = user.role === 'individual';
  const isAmbulance = user.role === 'ambulance';
  const canCreateRequest = isHospital || isIndividual || isAdmin;
  const canCreateAdvancedRequest = isHospital || isAdmin;

  return (
    <SidebarMenu>
      {/* Dashboard */}
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={isActive('/dashboard')}
          tooltip={collapsed ? "Dashboard" : undefined}
        >
          <Link to="/dashboard" className={cn(
            "flex items-center",
            isActive('/dashboard') ? "text-primary font-medium" : "text-gray-600"
          )}>
            <LayoutDashboard className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Dashboard</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Solicitudes */}
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={isActive('/solicitudes')}
          tooltip={collapsed ? "Solicitudes" : undefined}
        >
          <Link to="/solicitudes" className={cn(
            "flex items-center",
            isActive('/solicitudes') ? "text-primary font-medium" : "text-gray-600"
          )}>
            <FileText className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Solicitudes</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Nueva Solicitud - Solo para hospital, individual y admin */}
      {canCreateRequest && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            isActive={isActive('/solicitud')}
            tooltip={collapsed ? "Nueva Solicitud" : undefined}
          >
            <Link to="/solicitud" className={cn(
              "flex items-center",
              isActive('/solicitud') ? "text-primary font-medium" : "text-gray-600"
            )}>
              <Plus className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Nueva Solicitud</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      {/* Solicitud Avanzada - Solo para hospital y admin */}
      {canCreateAdvancedRequest && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            isActive={isActive('/solicitud-avanzada')}
            tooltip={collapsed ? "Solicitud Avanzada" : undefined}
          >
            <Link to="/solicitud-avanzada" className={cn(
              "flex items-center",
              isActive('/solicitud-avanzada') ? "text-primary font-medium" : "text-gray-600"
            )}>
              <Plus className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Solicitud Avanzada</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      {/* Mensajes */}
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={isActive('/mensajes')}
          tooltip={collapsed ? "Mensajes" : undefined}
        >
          <Link to="/mensajes" className={cn(
            "flex items-center",
            isActive('/mensajes') ? "text-primary font-medium" : "text-gray-600"
          )}>
            <MessageSquare className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Mensajes</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Sección de Administración - Solo para admin y empresas de ambulancias */}
      {(isAdmin || isAmbulance) && (
        <>
          <div className="mt-6 mb-2 px-3">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Administración
              </h3>
            )}
            {collapsed && <hr className="border-t border-gray-200" />}
          </div>

          {/* Admin Dashboard */}
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive('/admin/dashboard')}
                tooltip={collapsed ? "Panel de Admin" : undefined}
              >
                <Link to="/admin/dashboard" className={cn(
                  "flex items-center",
                  isActive('/admin/dashboard') ? "text-primary font-medium" : "text-gray-600"
                )}>
                  <LayoutDashboard className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Panel de Admin</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Gestión de Usuarios - Solo admin */}
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isActive('/admin/usuarios')}
                tooltip={collapsed ? "Usuarios" : undefined}
              >
                <Link to="/admin/usuarios" className={cn(
                  "flex items-center",
                  isActive('/admin/usuarios') ? "text-primary font-medium" : "text-gray-600"
                )}>
                  <Users className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">Usuarios</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {/* Vehículos - Admin y empresas de ambulancias */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isActive('/admin/vehiculos') || isActive('/vehiculos')}
              tooltip={collapsed ? "Vehículos" : undefined}
            >
              <Link to={isAdmin ? "/admin/vehiculos" : "/vehiculos"} className={cn(
                "flex items-center",
                (isActive('/admin/vehiculos') || isActive('/vehiculos')) ? "text-primary font-medium" : "text-gray-600"
              )}>
                <Ambulance className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Vehículos</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Seguimiento - Admin y empresas de ambulancias */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              isActive={isActive('/admin/tracking') || isActive('/seguimiento')}
              tooltip={collapsed ? "Seguimiento" : undefined}
            >
              <Link to={isAdmin ? "/admin/tracking" : "/seguimiento"} className={cn(
                "flex items-center",
                (isActive('/admin/tracking') || isActive('/seguimiento')) ? "text-primary font-medium" : "text-gray-600"
              )}>
                <Bell className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Seguimiento</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </>
      )}

      {/* Perfil de usuario */}
      <SidebarMenuItem>
        <SidebarMenuButton 
          asChild 
          isActive={isActive('/perfil')}
          tooltip={collapsed ? "Mi Perfil" : undefined}
        >
          <Link to="/perfil" className={cn(
            "flex items-center",
            isActive('/perfil') ? "text-primary font-medium" : "text-gray-600"
          )}>
            <User className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Mi Perfil</span>}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      
      {/* Configuración - Solo admin */}
      {isAdmin && (
        <SidebarMenuItem>
          <SidebarMenuButton 
            asChild 
            isActive={isActive('/admin/configuracion')}
            tooltip={collapsed ? "Configuración" : undefined}
          >
            <Link to="/admin/configuracion" className={cn(
              "flex items-center",
              isActive('/admin/configuracion') ? "text-primary font-medium" : "text-gray-600"
            )}>
              <Settings className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Configuración</span>}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
};
