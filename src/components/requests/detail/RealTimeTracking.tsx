
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveMap } from "@/components/map/LiveMap";
import { useEffect, useState } from "react";
import { locationService } from "@/services/api/locationService";
import { VehicleLocation } from "@/types/location";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, MapPin, Truck } from "lucide-react";

interface RealTimeTrackingProps {
  requestId: string;
  vehicleId?: string;
}

export const RealTimeTracking = ({ requestId, vehicleId }: RealTimeTrackingProps) => {
  const [vehicle, setVehicle] = useState<VehicleLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vehicleId) {
      setLoading(false);
      return;
    }

    const fetchVehicleLocation = async () => {
      try {
        setLoading(true);
        const data = await locationService.getVehicleLocation(vehicleId);
        setVehicle(data);
      } catch (error) {
        console.error("Error fetching vehicle location:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleLocation();
    const interval = setInterval(fetchVehicleLocation, 10000);
    return () => clearInterval(interval);
  }, [vehicleId]);

  if (!vehicleId) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" /> Seguimiento en tiempo real
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <>
            <div className="mb-4">
              {vehicle && (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{vehicleId}</span>
                    <span className="text-sm text-muted-foreground">
                      ({vehicle.licensePlate})
                    </span>
                  </div>
                  
                  {vehicle.estimatedArrival && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Tiempo estimado de llegada: <span className="font-medium">
                          {new Date(vehicle.estimatedArrival).toLocaleTimeString('es-ES')}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <LiveMap 
              height="300px" 
              showControls={false}
              centerOnVehicle={vehicleId}
              highlightRequest={requestId}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
