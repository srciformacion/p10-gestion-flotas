
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification, NotificationPreference, MessageTemplate } from '@/types/notification';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { RequestStatus } from '@/types/request';

// Plantillas de mensajes predefinidas
const DEFAULT_MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: '1',
    name: 'Solicitud Asignada',
    content: 'Su solicitud #{requestId} ha sido asignada al vehículo {vehicle}. Tiempo estimado de llegada: {eta}',
    category: 'status_update',
    roles: ['admin', 'centroCoordinador'],
    variables: ['requestId', 'vehicle', 'eta']
  },
  {
    id: '2',
    name: 'En Camino',
    content: 'El vehículo {vehicle} está en camino a su ubicación. Llegada estimada: {eta}',
    category: 'status_update',
    roles: ['ambulance'],
    variables: ['vehicle', 'eta']
  },
  {
    id: '3',
    name: 'Servicio Completado',
    content: 'El servicio de transporte se ha completado satisfactoriamente. Gracias por confiar en nosotros.',
    category: 'status_update',
    roles: ['ambulance', 'admin']
  },
  {
    id: '4',
    name: 'Respuesta Urgente',
    content: 'Entendido, procesando su solicitud urgente inmediatamente. Un coordinador se pondrá en contacto enseguida.',
    category: 'emergency',
    roles: ['admin', 'centroCoordinador']
  },
  {
    id: '5',
    name: 'Información Adicional',
    content: 'Para procesar su solicitud, necesitamos información adicional. ¿Podría proporcionar más detalles sobre {topic}?',
    category: 'response',
    roles: ['admin', 'centroCoordinador'],
    variables: ['topic']
  },
  {
    id: '6',
    name: 'Cancelación de Servicio',
    content: 'Su solicitud #{requestId} ha sido cancelada. Si necesita reprogramar, no dude en contactarnos.',
    category: 'status_update',
    roles: ['admin', 'centroCoordinador'],
    variables: ['requestId']
  }
];

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  messageTemplates: MessageTemplate[];
  preferences: NotificationPreference;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'userId'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  requestPushPermission: () => Promise<boolean>;
  sendPushNotification: (title: string, body: string, options?: NotificationOptions) => void;
  updatePreferences: (preferences: Partial<NotificationPreference>) => void;
  createNotificationFromTemplate: (templateId: string, variables?: Record<string, string>) => string;
  addStatusUpdateNotification: (requestId: string, oldStatus: RequestStatus, newStatus: RequestStatus) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messageTemplates] = useState<MessageTemplate[]>(DEFAULT_MESSAGE_TEMPLATES);
  const [preferences, setPreferences] = useState<NotificationPreference>({
    userId: user?.id || '',
    pushEnabled: false,
    emailEnabled: true,
    categories: {
      request_status: true,
      system: true,
      chat: true,
      maintenance: false
    },
    urgentOnly: false
  });

  // Solicitar permisos de notificación al cargar
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setPreferences(prev => ({ ...prev, pushEnabled: permission === 'granted' }));
      });
    }
  }, []);

  // Generar notificaciones automáticas para cambios de estado
  const getStatusUpdateMessage = (oldStatus: RequestStatus, newStatus: RequestStatus): { title: string; message: string; type: any } => {
    const statusMessages = {
      pending: { title: 'Solicitud Pendiente', message: 'Su solicitud está pendiente de asignación', type: 'info' as const },
      assigned: { title: 'Vehículo Asignado', message: 'Se ha asignado un vehículo a su solicitud', type: 'success' as const },
      inRoute: { title: 'En Camino', message: 'El vehículo está en camino a su ubicación', type: 'info' as const },
      completed: { title: 'Servicio Completado', message: 'El servicio de transporte se ha completado', type: 'success' as const },
      cancelled: { title: 'Servicio Cancelado', message: 'Su solicitud ha sido cancelada', type: 'warning' as const }
    };

    return statusMessages[newStatus] || { title: 'Actualización', message: 'Estado actualizado', type: 'info' as const };
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'userId'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      userId: user?.id || '',
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Mostrar toast
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default'
    });

    // Enviar notificación push si está habilitada
    if (preferences.pushEnabled && preferences.categories[notification.category]) {
      sendPushNotification(notification.title, notification.message);
    }
  };

  const addStatusUpdateNotification = (requestId: string, oldStatus: RequestStatus, newStatus: RequestStatus) => {
    const { title, message, type } = getStatusUpdateMessage(oldStatus, newStatus);
    
    addNotification({
      title,
      message: `${message} (Solicitud #${requestId})`,
      type,
      category: 'request_status',
      priority: newStatus === 'assigned' || newStatus === 'inRoute' ? 'high' : 'medium',
      requestId,
      actionUrl: `/solicitud/${requestId}`,
      actionLabel: 'Ver Detalles'
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const requestPushPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    
    setPreferences(prev => ({ ...prev, pushEnabled: granted }));
    return granted;
  };

  const sendPushNotification = (title: string, body: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
  };

  const updatePreferences = (newPreferences: Partial<NotificationPreference>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const createNotificationFromTemplate = (templateId: string, variables?: Record<string, string>): string => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (!template) return '';

    let content = template.content;
    if (variables && template.variables) {
      template.variables.forEach(variable => {
        if (variables[variable]) {
          content = content.replace(`{${variable}}`, variables[variable]);
        }
      });
    }

    return content;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      messageTemplates,
      preferences,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      requestPushPermission,
      sendPushNotification,
      updatePreferences,
      createNotificationFromTemplate,
      addStatusUpdateNotification
    }}>
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
