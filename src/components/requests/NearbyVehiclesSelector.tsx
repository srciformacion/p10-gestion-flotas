
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locationService } from "@/services/api/locationService";
import { VehicleLocation } from "@/types/location";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface NearbyVehiclesSelectorProps {
  origin: string;
  onSelectVehicle: (vehicleId: string) => void;
  selectedVehicle?: string;
}

export const NearbyVehiclesSelector = ({ 
  origin, 
  onSelectVehicle, 
  selectedVehicle 
}: NearbyVehiclesSelectorProps) => {
  const [vehicles, setVehicles] = useState<Array<VehicleLocation & { distance: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyVehicles = async () => {
      if (!origin) return;
      
      try {
        setLoading(true);
        
        // Simular coordenadas a partir del origen (en producción usar geocodificación real)
        const originCoords = simulateGeocode(origin);
        
        // Obtener todos los vehículos
        const allVehicles = await locationService.getVehicleLocations();
        
        // Filtrar sólo los disponibles
        const availableVehicles = allVehicles.filter(v => v.status === 'available');
        
        // Calcular distancias
        const vehiclesWithDistance = availableVehicles.map(vehicle => {
          const distance = calculateDistance(
            originCoords.latitude,
            originCoords.longitude,
            vehicle.location.latitude,
            vehicle.location.longitude
          );
          
          return {
            ...vehicle,
            distance
          };
        });
        
        // Ordenar por distancia
        vehiclesWithDistance.sort((a, b) => a.distance - b.distance);
        
        setVehicles(vehiclesWithDistance);
      } catch (error) {
        console.error("Error fetching nearby vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyVehicles();
  }, [origin]);

  // Simulación de geocodificación (en producción usar API real)
  function simulateGeocode(address: string): { latitude: number; longitude: number } {
    // Base: coordenadas de La Rioja, España
    const baseLat = 42.4627;
    const baseLng = -2.4450;
    
    // Generar variación basada en hash simple de la dirección
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      hash = ((hash << 5) - hash) + address.charCodeAt(i);
      hash |= 0;
    }
    
    // Variación de ±0.1 grados aprox
    const latVariation = (hash % 100) / 1000;
    const lngVariation = ((hash / 100) % 100) / 1000;
    
    return {
      latitude: baseLat + latVariation,
      longitude: baseLng + lngVariation
    };
  }

  // Cálculo de distancia entre dos puntos geográficos usando Haversine
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distancia en km
    return distance;
  }

  function deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No hay vehículos disponibles cercanos a la ubicación.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Select 
        value={selectedVehicle} 
        onValueChange={onSelectVehicle}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar vehículo cercano" />
        </SelectTrigger>
        <SelectContent>
          {vehicles.map((vehicle) => (
            <SelectItem key={vehicle.id} value={vehicle.id}>
              <div className="flex items-center justify-between w-full">
                <span>{vehicle.id} ({vehicle.licensePlate})</span>
                <Badge variant="outline" className="ml-2">
                  {vehicle.distance.toFixed(1)} km
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedVehicle && (
        <div className="text-xs text-muted-foreground">
          * Se asignará una estimación de llegada automáticamente al confirmar
        </div>
      )}
    </div>
  );
};
