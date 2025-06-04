
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  FileText, 
  Ambulance, 
  Users, 
  Route, 
  MapPin, 
  Brain, 
  MessageSquare, 
  Settings,
  BarChart3,
  Smartphone,
  Plus
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();

  const isActive = (path: string) => location.pathname === path;
  const collapsed = state === "collapsed";

  const getNavClasses = (path: string) => {
    const baseClasses = "w-full justify-start transition-all duration-200 font-medium";
    if (isActive(path)) {
      return `${baseClasses} bg-rioja-green text-rioja-white shadow-md`;
    }
    return `${baseClasses} text-rioja-white/90 hover:bg-rioja-green/20 hover:text-rioja-white`;
  };

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "centroCoordinador", "hospital", "equipoMovil", "ambulance"]
    },
    {
      title: "Solicitudes",
      url: "/solicitudes",
      icon: FileText,
      roles: ["admin", "centroCoordinador", "hospital", "individual", "ambulance"]
    },
    {
      title: "Ambulancias",
      url: "/ambulancias",
      icon: Ambulance,
      roles: ["admin", "centroCoordinador", "ambulance"]
    },
    {
      title: "Usuarios",
      url: "/usuarios",
      icon: Users,
      roles: ["admin", "ambulance"]
    },
    {
      title: "Rutas",
      url: "/rutas",
      icon: Route,
      roles: ["admin", "centroCoordinador", "ambulance"]
    },
    {
      title: "Seguimiento",
      url: "/seguimiento",
      icon: MapPin,
      roles: ["admin", "centroCoordinador", "hospital", "ambulance"]
    },
    {
      title: "Despacho IA",
      url: "/despacho",
      icon: Brain,
      roles: ["admin", "centroCoordinador", "ambulance"]
    },
    {
      title: "Equipo Móvil",
      url: "/equipo-movil",
      icon: Smartphone,
      roles: ["equipoMovil"]
    },
    {
      title: "Analíticas",
      url: "/analiticas",
      icon: BarChart3,
      roles: ["admin", "centroCoordinador"]
    },
    {
      title: "Mensajes",
      url: "/mensajes",
      icon: MessageSquare,
      roles: ["admin", "centroCoordinador", "hospital", "individual", "equipoMovil", "ambulance"]
    },
    {
      title: "Configuración",
      url: "/configuracion",
      icon: Settings,
      roles: ["admin", "centroCoordinador", "ambulance"]
    }
  ];

  const filteredItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 border-r border-rioja-blue/30 bg-rioja-blue shadow-lg`}>
      <SidebarContent>
        {/* Header del sidebar */}
        <div className="p-4 border-b border-rioja-blue/30">
          {!collapsed ? (
            <Logo />
          ) : (
            <div className="w-8 h-8 bg-rioja-green rounded-lg flex items-center justify-center shadow-md">
              <Plus className="w-4 h-4 text-rioja-white" />
            </div>
          )}
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-rioja-white/80 font-semibold px-4 text-sm uppercase tracking-wide">
            {!collapsed && "Navegación Principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <Link 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Perfil de usuario en sidebar */}
        {user && (
          <div className="px-4 py-4 mt-auto border-t border-rioja-blue/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rioja-green rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs font-semibold text-rioja-white">
                  {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-rioja-white">{user.name}</span>
                  <span className="text-xs text-rioja-white/70">{user.role}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
