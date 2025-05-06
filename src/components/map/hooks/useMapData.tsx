
import { useState, useEffect } from 'react';
import { VehicleLocation, LocationAlert } from '@/types/location';
import { locationService } from '@/services/api/locationService';
import { useToast } from '@/hooks/use-toast';
import { useRequests } from '@/context/requests';

export const useMapData = () => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [alerts, setAlerts] = useState<LocationAlert[]>([]);
  const { toast } = useToast();
  const { getRequestById } = useRequests();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const locations = await locationService.getVehicleLocations();
        setVehicles(locations);
        
        // Fetch active alerts
        const activeAlerts = await locationService.getAlerts(false);
        setAlerts(activeAlerts);
        
        // Notify about new alerts
        const newAlerts = activeAlerts.filter(alert => {
          // Consider alert as new if created in the last 10 seconds
          const alertTime = new Date(alert.timestamp).getTime();
          const tenSecondsAgo = Date.now() - 10000;
          return alertTime > tenSecondsAgo;
        });
        
        newAlerts.forEach(alert => {
          const requestId = alert.requestId;
          const request = getRequestById(requestId);
          const patientName = request ? request.patientName : requestId;
          
          toast({
            title: `Alerta: ${alert.type === 'delay' ? 'Retraso' : 
                    alert.type === 'detour' ? 'Desvío' : 'Parada no programada'}`,
            description: `${alert.details} para el paciente ${patientName}`,
            variant: "destructive"
          });
        });
      } catch (error) {
        console.error("Error fetching vehicle locations:", error);
      } finally {
        setLoading(false);
      }
    };

    // Initial data fetch
    fetchLocations();

    // Set up update interval
    const interval = setInterval(fetchLocations, 10000);
    return () => clearInterval(interval);
  }, [getRequestById, toast]);

  return { vehicles, alerts, loading };
};
