
import { useState, useEffect } from 'react';
import { locationService } from '@/services/api/locationService';
import { LocationAlert } from '@/types/location';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRequests } from '@/context/requests';
import { ScrollArea } from '@/components/ui/scroll-area';

export const LocationAlerts = () => {
  const [alerts, setAlerts] = useState<LocationAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { getRequestById } = useRequests();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const activeAlerts = await locationService.getAlerts(false);
        setAlerts(activeAlerts);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveAlert = async (alertId: string) => {
    try {
      await locationService.resolveAlert(alertId);
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
      toast({
        title: "Alerta resuelta",
        description: "La alerta ha sido marcada como resuelta.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: "Error",
        description: "No se pudo resolver la alerta.",
        variant: "destructive",
      });
    }
  };

  const getAlertTypeString = (type: string): string => {
    switch (type) {
      case 'delay': return 'Retraso';
      case 'detour': return 'Desvío';
      case 'stopped': return 'Parada prolongada';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">Cargando alertas...</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-4 flex items-center justify-center h-full">
        <p className="text-gray-500 text-sm">No hay alertas activas</p>
      </div>
    );
  }

  return (
    <div className="p-2 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm flex items-center gap-1">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Alertas activas ({alerts.length})
        </h3>
      </div>
      <ScrollArea className="h-[calc(100%-28px)]">
        <div className="space-y-2">
          {alerts.map((alert) => {
            const request = getRequestById(alert.requestId);
            return (
              <div
                key={alert.id}
                className="bg-gray-50 p-2 rounded-md border border-gray-200 flex justify-between text-sm items-center"
              >
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{getAlertTypeString(alert.type)}</span>
                    <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                      {alert.vehicleId}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{alert.details}</p>
                  <p className="text-xs text-gray-500">
                    {request ? `Paciente: ${request.patientName}` : `ID solicitud: ${alert.requestId}`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(alert.timestamp).toLocaleString('es-ES')}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={() => handleResolveAlert(alert.id)}
                >
                  <Check className="h-3.5 w-3.5" />
                  <span className="text-xs">Resolver</span>
                </Button>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
