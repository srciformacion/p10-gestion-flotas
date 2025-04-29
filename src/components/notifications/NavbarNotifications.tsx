
import React, { useCallback } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/context/NotificationsContext';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavbarNotifications = React.memo(() => {
  const { notifications, unreadCount } = useNotifications();
  
  const renderNotifications = useCallback(() => {
    if (notifications.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-gray-500">
          No hay notificaciones
        </div>
      );
    }
    
    return notifications.map((notification) => (
      <DropdownMenuItem key={notification.id}>
        {notification.message}
      </DropdownMenuItem>
    ));
  }, [notifications]);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {renderNotifications()}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

NavbarNotifications.displayName = "NavbarNotifications";
