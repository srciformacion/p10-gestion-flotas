
import React from "react";
import { Link } from "react-router-dom";
import { User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User as UserIcon } from "lucide-react";

interface UserMenuProps {
  user: User;
  logout: () => void;
}

export const UserMenu = React.memo(({ user, logout }: UserMenuProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const roleLabels = {
    'admin': 'Administrador',
    'hospital': 'Centro médico',
    'individual': 'Paciente',
    'ambulance': 'Servicio de ambulancias'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-8 w-8 bg-primary text-white cursor-pointer hover:opacity-90 transition-opacity">
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <DropdownMenuLabel className="font-medium">{user.name}</DropdownMenuLabel>
          <DropdownMenuLabel className="text-xs text-gray-500 font-normal">{user.email}</DropdownMenuLabel>
          <div className="mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
              {roleLabels[user.role] || user.role}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/perfil" className="flex items-center cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Mi Perfil</span>
          </Link>
        </DropdownMenuItem>
        {user.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link to="/admin/configuracion" className="flex items-center cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

UserMenu.displayName = "UserMenu";
