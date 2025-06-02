
import { Bell, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";

export function AppHeader() {
  const { user, logout } = useAuth();
  const { totalUnread } = useChat();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'Administrador',
      centroCoordinador: 'Centro Coordinador',
      hospital: 'Hospital',
      individual: 'Usuario Individual',
      equipoMovil: 'Equipo Móvil',
      ambulance: 'Ambulancia'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  return (
    <header className="h-14 border-b bg-rioja-blue text-white shadow-md flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-white hover:text-rioja-green transition-colors" />
        <h1 className="font-semibold text-lg">Sistema de Gestión de Ambulancias</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Notificaciones */}
        <Link to="/mensajes">
          <Button variant="ghost" size="sm" className="relative text-white hover:text-rioja-green hover:bg-white/10">
            <Bell className="h-4 w-4" />
            {totalUnread > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {totalUnread > 9 ? '9+' : totalUnread}
              </Badge>
            )}
          </Button>
        </Link>

        {/* Menú de usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-rioja-green hover:bg-white/10">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-rioja-green text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs opacity-75">
                  {getRoleDisplayName(user?.role || '')}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-rioja-blue">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
              <p className="text-xs text-gray-600">
                {getRoleDisplayName(user?.role || '')}
              </p>
            </div>
            
            <DropdownMenuSeparator />
            
            <Link to="/perfil">
              <DropdownMenuItem className="cursor-pointer text-rioja-blue hover:bg-rioja-green/10">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
            </Link>
            
            <Link to="/configuracion">
              <DropdownMenuItem className="cursor-pointer text-rioja-blue hover:bg-rioja-green/10">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </DropdownMenuItem>
            </Link>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-rioja-blue hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
