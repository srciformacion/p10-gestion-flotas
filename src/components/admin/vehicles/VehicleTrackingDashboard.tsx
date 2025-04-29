
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveMap } from "@/components/map/LiveMap";
import { LocationAlerts } from "@/components/map/LocationAlerts";
import { VehicleLocation } from "@/types/location";
import { locationService } from "@/services/api/locationService";
import { Truck, MapPin, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const VehicleTrackingDashboard = () => {
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await locationService.getVehicleLocations();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
    const interval = setInterval(fetchVehicles, 15000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'busy':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'busy':
        return 'En servicio';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mapa principal */}
        <div className="w-full md:w-2/3">
          <LiveMap 
            height="600px" 
            centerOnVehicle={selectedVehicle}
          />
        </div>

        {/* Panel lateral */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Lista de vehículos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" /> Vehículos ({vehicles.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto px-2">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 mb-2" />
                ))
              ) : (
                <div className="space-y-2">
                  {vehicles.map((vehicle) => (
                    <Button
                      key={vehicle.id}
                      variant={selectedVehicle === vehicle.id ? "default" : "outline"}
                      className="w-full justify-between h-auto py-2 px-3"
                      onClick={() => setSelectedVehicle(vehicle.id === selectedVehicle ? undefined : vehicle.id)}
                    >
                      <div className="flex flex-col items-start">
                        <div className="font-medium">{vehicle.id}</div>
                        <div className="text-xs text-muted-foreground">
                          {vehicle.licensePlate}
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                        {getStatusLabel(vehicle.status)}
                      </Badge>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alertas */}
          <LocationAlerts />
        </div>
      </div>
    </div>
  );
};
