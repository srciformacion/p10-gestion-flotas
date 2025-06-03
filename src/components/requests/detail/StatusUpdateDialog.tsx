
import { VehicleSelector } from "@/components/requests/VehicleSelector";
import { VehicleDetails } from "@/types/vehicle";

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleInfo: {
    vehicle: string;
    eta: string;
  };
  onVehicleInfoChange: (info: { vehicle: string; eta: string }) => void;
  onConfirm: () => void;
  isUpdating: boolean;
  newStatus: 'assigned' | 'inRoute' | null;
  onVehicleSelect?: (vehicle: VehicleDetails, eta: string) => void;
}

export const StatusUpdateDialog = ({
  open,
  onOpenChange,
  vehicleInfo,
  onVehicleInfoChange,
  onConfirm,
  isUpdating,
  newStatus,
  onVehicleSelect
}: StatusUpdateDialogProps) => {
  const handleVehicleSelect = (vehicle: VehicleDetails, eta: string) => {
    onVehicleInfoChange({ 
      vehicle: `${vehicle.vehicleId} - ${vehicle.licensePlate}`, 
      eta 
    });
    if (onVehicleSelect) {
      onVehicleSelect(vehicle, eta);
    }
    onConfirm();
  };

  return (
    <VehicleSelector
      open={open}
      onOpenChange={onOpenChange}
      onVehicleSelect={handleVehicleSelect}
      isUpdating={isUpdating}
    />
  );
};
