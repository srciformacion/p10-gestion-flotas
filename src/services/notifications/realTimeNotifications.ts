
import { TransportRequest } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/context/NotificationsContext";

type NotificationCallback = (notification: {
  type: 'status_change' | 'new_request' | 'assignment';
  requestId: string;
  status?: TransportRequest['status'];
  data?: any;
}) => void;

class RealTimeNotificationService {
  private listeners: NotificationCallback[] = [];
  private subscription: any = null;
  
  constructor() {
    // Iniciar suscripción a canal de realtime de Supabase
    this.setupRealtimeSubscription();
  }

  /**
   * Configura la suscripción a eventos en tiempo real
   */
  setupRealtimeSubscription() {
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
    }
    
    // Suscribirse al canal de notificaciones
    this.subscription = supabase
      .channel('transport-notifications')
      .on('broadcast', { event: 'status_change' }, (payload) => {
        this.listeners.forEach(listener => listener({
          type: 'status_change',
          requestId: payload.payload.requestId,
          status: payload.payload.status,
          data: payload.payload
        }));
      })
      .on('broadcast', { event: 'new_request' }, (payload) => {
        this.listeners.forEach(listener => listener({
          type: 'new_request',
          requestId: payload.payload.requestId,
          data: payload.payload
        }));
      })
      .on('broadcast', { event: 'assignment' }, (payload) => {
        this.listeners.forEach(listener => listener({
          type: 'assignment',
          requestId: payload.payload.requestId,
          data: payload.payload
        }));
      })
      .subscribe();
  }

  /**
   * Suscribe un callback para recibir notificaciones
   */
  subscribe(callback: NotificationCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Envía una notificación a través del canal de realtime
   */
  async sendNotification(event: string, payload: any) {
    try {
      await supabase
        .channel('transport-notifications')
        .send({
          type: 'broadcast',
          event: event,
          payload: payload
        });
      return true;
    } catch (error) {
      console.error('Error enviando notificación:', error);
      return false;
    }
  }

  /**
   * Limpia las suscripciones al destruir el servicio
   */
  cleanup() {
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
      this.subscription = null;
    }
    this.listeners = [];
  }
}

// Instancia singleton del servicio
export const realTimeNotificationService = new RealTimeNotificationService();

/**
 * Hook para usar notificaciones en tiempo real
 */
export const useRealTimeNotifications = () => {
  const { addNotification } = useNotifications();
  
  // Suscribirse a notificaciones en tiempo real
  React.useEffect(() => {
    const unsubscribe = realTimeNotificationService.subscribe((notification) => {
      // Convertir notificaciones en tiempo real a notificaciones del sistema
      switch (notification.type) {
        case 'status_change':
          addNotification({
            title: 'Cambio de estado',
            message: `La solicitud ${notification.requestId} cambió a ${notification.status}`,
            type: 'info'
          });
          break;
        case 'new_request':
          addNotification({
            title: 'Nueva solicitud',
            message: `Se ha creado la solicitud ${notification.requestId}`,
            type: 'success'
          });
          break;
        case 'assignment':
          addNotification({
            title: 'Vehículo asignado',
            message: `Se ha asignado un vehículo a la solicitud ${notification.requestId}`,
            type: 'info'
          });
          break;
      }
    });
    
    return unsubscribe;
  }, [addNotification]);
  
  return { realTimeNotificationService };
};
