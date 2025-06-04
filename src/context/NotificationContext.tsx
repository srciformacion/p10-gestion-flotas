
import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Notification } from '@/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'userId' | 'timestamp'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  addStatusUpdateNotification: (requestId: string, oldStatus: string, newStatus: string) => void;
  requestNotificationPermission: () => Promise<boolean>;
  preferences: NotificationPreferences;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
}

interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  requestStatusChanges: boolean;
  vehicleAssignments: boolean;
  emergencyAlerts: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const defaultPreferences: NotificationPreferences = {
  pushEnabled: true,
  emailEnabled: true,
  requestStatusChanges: true,
  vehicleAssignments: true,
  emergencyAlerts: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  }
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);

  // Cargar notificaciones del localStorage al inicializar
  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }

    const storedPreferences = localStorage.getItem('notificationPreferences');
    if (storedPreferences) {
      try {
        setPreferences(JSON.parse(storedPreferences));
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    }
  }, []);

  // Guardar notificaciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Guardar preferencias en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'userId' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      userId: 'current-user', // En producción esto vendría del contexto de autenticación
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Mostrar notificación push si está habilitada
    if (preferences.pushEnabled && shouldShowNotification(notification.category)) {
      showPushNotification(newNotification);
    }
  };

  const shouldShowNotification = (category: string): boolean => {
    switch (category) {
      case 'request_status':
        return preferences.requestStatusChanges;
      case 'vehicle_assignment':
        return preferences.vehicleAssignments;
      case 'emergency':
        return preferences.emergencyAlerts;
      default:
        return true;
    }
  };

  const isQuietTime = (): boolean => {
    if (!preferences.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return currentTime >= preferences.quietHours.start || currentTime <= preferences.quietHours.end;
  };

  const showPushNotification = (notification: Notification) => {
    // No mostrar durante horas silenciosas (excepto emergencias)
    if (isQuietTime() && notification.category !== 'emergency') {
      return;
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'high',
        data: {
          url: notification.actionUrl
        }
      });
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  // Función específica para notificaciones de cambio de estado
  const addStatusUpdateNotification = (requestId: string, oldStatus: string, newStatus: string) => {
    const statusMessages = {
      pending: 'Pendiente',
      assigned: 'Asignado',
      inRoute: 'En camino', 
      completed: 'Completado',
      cancelled: 'Cancelado'
    };

    const priority = newStatus === 'cancelled' ? 'high' : 'medium';
    
    addNotification({
      title: 'Estado de solicitud actualizado',
      message: `La solicitud ${requestId} cambió de ${statusMessages[oldStatus as keyof typeof statusMessages]} a ${statusMessages[newStatus as keyof typeof statusMessages]}`,
      type: newStatus === 'cancelled' ? 'warning' : 'info',
      category: 'request_status',
      priority,
      requestId,
      actionUrl: `/solicitud/${requestId}`,
      actionLabel: 'Ver detalles',
      read: false
    });
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    addStatusUpdateNotification,
    requestNotificationPermission,
    preferences,
    updatePreferences
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
