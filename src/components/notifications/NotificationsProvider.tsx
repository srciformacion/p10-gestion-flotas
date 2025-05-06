
import { useEffect } from 'react';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { useRealTimeNotifications } from '@/services/notifications/realTimeNotifications';

export const NotificationsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <NotificationsProvider>
      <NotificationsIntegration>
        {children}
      </NotificationsIntegration>
    </NotificationsProvider>
  );
};

// Componente que integra las notificaciones en tiempo real
const NotificationsIntegration = ({ children }: { children: React.ReactNode }) => {
  // Este hook configura las suscripciones a notificaciones en tiempo real
  useRealTimeNotifications();
  
  return <>{children}</>;
};
