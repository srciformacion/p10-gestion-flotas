
import { NotificationBell } from './NotificationBell';
import { NotificationsProvider } from '@/context/NotificationsContext';

export const NotificationsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotificationsProvider>
      {children}
    </NotificationsProvider>
  );
};
