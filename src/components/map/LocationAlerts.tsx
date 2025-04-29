
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { locationService } from "@/services/api/locationService";
import { LocationAlert } from "@/types/location";
import { Bell, Check, Truck, MapPin } from "lucide-react";
import { useRequests } from "@/context/RequestsContext";
import { formatDistance } from "date-fns";
import { es } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const LocationAlerts = () => {
  const [activeAlerts, setActiveAlerts] = useState<LocationAlert[]>([]);
  const [resolvedAlerts, setResolvedAlerts] = useState<LocationAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const { getRequestById } = useRequests();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const active = await locationService.getAlerts(false);
        setActiveAlerts(active);
        
        const resolved = await locationService.getAlerts(true);
        setResolvedAlerts(resolved);
      } catch (error) {
        console.error("Error fetching location alerts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveAlert = async (alertId: string) => {
    try {
      await locationService.resolveAlert(alertId);
      
      // Actualizar las listas
      const resolved = await locationService.resolveAlert(alertId);
      setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
      setResolvedAlerts(prev => [resolved, ...prev]);
    } catch (error) {
      console.error("Error resolving alert:", error);
    }
  };

  const renderAlertIcon = (type: string) => {
    switch(type) {
      case 'delay':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Retraso</Badge>;
      case 'detour':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Desvío</Badge>;
      case 'stopped':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Parada</Badge>;
      default:
        return <Badge variant="outline">Otro</Badge>;
    }
  };

  const formatAlertTime = (timestamp: string) => {
    try {
      return formatDistance(new Date(timestamp), new Date(), {
        addSuffix: true,
        locale: es
      });
    } catch (e) {
      return timestamp;
    }
  };

  const renderAlertList = (alerts: LocationAlert[], showResolveButton: boolean = false) => {
    if (loading) {
      return Array(3).fill(0).map((_, i) => (
        <Card key={i} className="mb-3">
          <CardContent className="p-4">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ));
    }

    if (alerts.length === 0) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          {showResolveButton 
            ? "No hay alertas activas" 
            : "No hay alertas resueltas"}
        </div>
      );
    }

    return alerts.map(alert => {
      const request = getRequestById(alert.requestId);
      
      return (
        <Card key={alert.id} className="mb-3">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {renderAlertIcon(alert.type)}
                  <span className="text-sm text-muted-foreground">
                    {formatAlertTime(alert.timestamp)}
                  </span>
                </div>
                <h4 className="font-medium">
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4" /> {alert.vehicleId}
                  </span>
                </h4>
                <p className="text-sm mt-1">{alert.details}</p>
                {request && (
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Paciente: </span>
                    {request.patientName}
                  </div>
                )}
              </div>
              
              {showResolveButton && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleResolveAlert(alert.id)}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4" /> Resolver
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" /> Alertas de Localización
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="active" className="relative">
              Activas
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeAlerts.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="resolved">Resueltas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            {renderAlertList(activeAlerts, true)}
          </TabsContent>
          
          <TabsContent value="resolved" className="mt-0">
            {renderAlertList(resolvedAlerts)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
