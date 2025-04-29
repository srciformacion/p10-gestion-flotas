
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RequestStatus } from "@/types";
import { VehicleSelectionForm } from "./components/VehicleSelectionForm";
import { GpsToggle } from "./components/GpsToggle";
import { useEtaCalculation } from "./hooks/useEtaCalculation";

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
  
  // Use the custom hook for ETA calculation
  const { estimatedEta } = useEtaCalculation({
    vehicleId: vehicleInfo.vehicle,
    origin,
    useGps
  });
  
  // Update vehicleInfo when estimatedEta changes
  useEffect(() => {
    if (estimatedEta) {
      onVehicleInfoChange({
        ...vehicleInfo,
        eta: estimatedEta
      });
    }
  }, [estimatedEta]);

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
          <VehicleSelectionForm
            origin={origin}
            useGps={useGps}
            vehicleInfo={vehicleInfo}
            onVehicleChange={handleVehicleChange}
            onEtaChange={handleETAChange}
          />
          
          {origin && <GpsToggle useGps={useGps} setUseGps={setUseGps} />}
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
