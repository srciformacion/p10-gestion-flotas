
import { NotificationBell } from './NotificationBell';
import { useNotifications } from '@/context/NotificationsContext';

export const NavbarNotifications = () => {
  const { notifications } = useNotifications();
  
  return (
    <NotificationBell />
  );
};
