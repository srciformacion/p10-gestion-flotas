
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimeNotifications = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Suscribirse a cambios en vehicle_locations
    const vehicleChannel = supabase
      .channel('vehicle-location-changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'vehicle_locations'
      }, (payload) => {
        console.log('Vehicle location updated:', payload.new);
      })
      .subscribe();

    // Suscribirse a nuevas alertas
    const alertsChannel = supabase
      .channel('location-alerts-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'location_alerts'
      }, (payload) => {
        console.log('New location alert:', payload.new);
        
        // Mostrar notificación de nueva alerta
        const alert = payload.new;
        if (alert) {
          const alertType = alert.type === 'delay' 
            ? 'Retraso' 
            : alert.type === 'detour' 
              ? 'Desvío' 
              : 'Parada no programada';
              
          toast({
            title: `Nueva alerta: ${alertType}`,
            description: alert.details,
            variant: "destructive",
            duration: 6000,
          });
        }
      })
      .subscribe();

    // Limpiar suscripciones al desmontar
    return () => {
      supabase.removeChannel(vehicleChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, [toast]);
};
