
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
  Smartphone
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

  const menuItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "centroCoordinador", "hospital", "equipoMovil"]
    },
    {
      title: "Solicitudes",
      url: "/solicitudes",
      icon: FileText,
      roles: ["admin", "centroCoordinador", "hospital", "individual", "equipoMovil"]
    },
    {
      title: "Ambulancias",
      url: "/ambulancias",
      icon: Ambulance,
      roles: ["admin", "centroCoordinador"]
    },
    {
      title: "Usuarios",
      url: "/usuarios",
      icon: Users,
      roles: ["admin"]
    },
    {
      title: "Rutas",
      url: "/rutas",
      icon: Route,
      roles: ["admin", "centroCoordinador"]
    },
    {
      title: "Seguimiento",
      url: "/seguimiento",
      icon: MapPin,
      roles: ["admin", "centroCoordinador", "hospital"]
    },
    {
      title: "Despacho IA",
      url: "/despacho",
      icon: Brain,
      roles: ["admin", "centroCoordinador"]
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
      roles: ["admin", "centroCoordinador", "hospital", "individual", "equipoMovil"]
    },
    {
      title: "Configuración",
      url: "/configuracion",
      icon: Settings,
      roles: ["admin", "centroCoordinador"]
    }
  ];

  const filteredItems = menuItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <Sidebar className={`bg-rioja-blue border-r border-rioja-blue/20 ${collapsed ? "w-14" : "w-60"}`}>
      <SidebarContent>
        <div className="p-4 border-b border-rioja-blue/20">
          <Logo />
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-rioja-white/70 font-semibold">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group">
                    <Link 
                      to={item.url} 
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive(item.url)
                          ? 'bg-rioja-green text-white font-medium'
                          : 'text-rioja-white hover:bg-rioja-green/20 hover:text-rioja-green'
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
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
