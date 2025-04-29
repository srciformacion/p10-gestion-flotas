
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequestStatus } from "@/types";
import { NearbyVehiclesSelector } from "@/components/requests/NearbyVehiclesSelector";
import { locationService } from "@/services/api/locationService";
import { addMinutes, format } from "date-fns";

interface VehicleInfo {
  vehicle: string;
  eta: string;
}

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleInfo: VehicleInfo;
  onVehicleInfoChange: (info: VehicleInfo) => void;
  onConfirm: () => void;
  isUpdating: boolean;
  newStatus: 'assigned' | 'inRoute' | null;
  origin?: string;
}

export const StatusUpdateDialog = ({
  open,
  onOpenChange,
  vehicleInfo,
  onVehicleInfoChange,
  onConfirm,
  isUpdating,
  newStatus,
  origin
}: StatusUpdateDialogProps) => {
  const [useGps, setUseGps] = useState(true);
  
  // Actualizar ETA cuando se selecciona un vehículo
  useEffect(() => {
    const updateEstimatedArrival = async () => {
      if (!vehicleInfo.vehicle || !useGps || !origin) return;
      
      try {
        // En producción, obtener ETA real basada en API de rutas
        // Aquí simulamos un tiempo basado en la distancia
        const vehicleData = await locationService.getVehicleLocation(vehicleInfo.vehicle);
        if (!vehicleData) return;
        
        const originCoords = simulateGeocode(origin);
        const distance = calculateDistance(
          originCoords.latitude,
          originCoords.longitude,
          vehicleData.location.latitude,
          vehicleData.location.longitude
        );
        
        // Estimación simple: 1 minuto por km + tiempo base de 5 minutos
        const estimatedMinutes = Math.round(distance + 5);
        const estimatedArrival = addMinutes(new Date(), estimatedMinutes);
        
        onVehicleInfoChange({
          ...vehicleInfo,
          eta: format(estimatedArrival, "yyyy-MM-dd'T'HH:mm:ss")
        });
      } catch (error) {
        console.error("Error updating ETA:", error);
      }
    };
    
    if (origin) {
      updateEstimatedArrival();
    }
  }, [vehicleInfo.vehicle, useGps, origin, onVehicleInfoChange]);
  
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

  const handleVehicleChange = (value: string) => {
    onVehicleInfoChange({
      ...vehicleInfo,
      vehicle: value
    });
  };

  const handleETAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVehicleInfoChange({
      ...vehicleInfo,
      eta: e.target.value
    });
  };

  const dialogTitle = newStatus === 'assigned' ? "Asignar Vehículo" : 
                      newStatus === 'inRoute' ? "Vehículo En Camino" : 
                      "Actualizar Estado";

  const dialogDescription = newStatus === 'assigned' ? "Seleccione el vehículo que realizará el servicio y estime su hora de llegada." : 
                          newStatus === 'inRoute' ? "Confirme que el vehículo está en camino." : 
                          "Actualice la información del servicio.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vehicle" className="text-right">
              Vehículo
            </Label>
            {origin && useGps ? (
              <div className="col-span-3">
                <NearbyVehiclesSelector 
                  origin={origin}
                  onSelectVehicle={handleVehicleChange}
                  selectedVehicle={vehicleInfo.vehicle}
                />
              </div>
            ) : (
              <Input
                id="vehicle"
                value={vehicleInfo.vehicle}
                onChange={(e) => handleVehicleChange(e.target.value)}
                className="col-span-3"
              />
            )}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estimatedArrival" className="text-right">
              Hora estimada
            </Label>
            <Input
              id="estimatedArrival"
              type="datetime-local"
              value={vehicleInfo.eta ? new Date(vehicleInfo.eta).toISOString().slice(0, 16) : ''}
              onChange={handleETAChange}
              className="col-span-3"
            />
          </div>
          
          {origin && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Usar GPS
              </Label>
              <div className="col-span-3">
                <div className="flex items-center space-x-2">
                  <input
                    id="useGps"
                    type="checkbox"
                    checked={useGps}
                    onChange={() => setUseGps(!useGps)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="useGps" className="text-sm">
                    Estimar llegada y mostrar vehículos cercanos
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isUpdating || !vehicleInfo.vehicle}>
            {isUpdating ? "Actualizando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
