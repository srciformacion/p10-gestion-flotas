
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Notification, useNotifications } from "@/context/NotificationsContext";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const { clearNotification } = useNotifications();

  // Format the timestamp to a readable format
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `hace ${diffMins} min`;
    if (diffHours < 24) return `hace ${diffHours} h`;
    if (diffDays === 1) return 'ayer';
    return `hace ${diffDays} días`;
  };

  // Get the appropriate icon based on notification type
  const renderIcon = () => {
    switch (notification.type) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenuItem
      className={cn(
        "flex items-start gap-2 p-3 cursor-default",
        !notification.read && "bg-muted/50"
      )}
    >
      <div className="mt-0.5">{renderIcon()}</div>
      <div className="flex-1">
        {notification.title && <div className="font-medium">{notification.title}</div>}
        <div className="text-sm text-muted-foreground">{notification.message}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {formatTime(notification.timestamp)}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          clearNotification(notification.id);
        }}
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </DropdownMenuItem>
  );
};
