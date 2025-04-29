
import { useState, useCallback, useMemo } from 'react';
import { BellDot, Bell } from 'lucide-react';
import { useNotifications } from '@/context/NotificationsContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationItem } from './NotificationItem';
import { memo } from 'react';

export const NotificationBell = memo(() => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      // Mark all as read when opening
      markAllAsRead();
    }
  }, [unreadCount, markAllAsRead]);

  const notificationList = useMemo(() => {
    return notifications.length > 0 ? (
      notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))
    ) : (
      <DropdownMenuItem disabled className="text-center py-4">
        No hay notificaciones
      </DropdownMenuItem>
    );
  }, [notifications]);

  const bellIcon = useMemo(() => {
    if (unreadCount > 0) {
      return (
        <>
          <BellDot className="h-6 w-6" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        </>
      );
    }
    return <Bell className="h-6 w-6" />;
  }, [unreadCount]);

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {bellIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-medium border-b">
          Notificaciones ({notifications.length})
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notificationList}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

NotificationBell.displayName = "NotificationBell";
