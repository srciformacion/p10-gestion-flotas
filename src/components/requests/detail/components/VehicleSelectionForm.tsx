
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NearbyVehiclesSelector } from "@/components/requests/NearbyVehiclesSelector";

interface VehicleSelectionFormProps {
  origin?: string;
  useGps: boolean;
  vehicleInfo: {
    vehicle: string;
    eta: string;
  };
  onVehicleChange: (value: string) => void;
  onEtaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VehicleSelectionForm: React.FC<VehicleSelectionFormProps> = ({
  origin,
  useGps,
  vehicleInfo,
  onVehicleChange,
  onEtaChange
}) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="vehicle" className="text-right">
          Vehículo
        </Label>
        {origin && useGps ? (
          <div className="col-span-3">
            <NearbyVehiclesSelector 
              origin={origin}
              onSelectVehicle={onVehicleChange}
              selectedVehicle={vehicleInfo.vehicle}
            />
          </div>
        ) : (
          <Input
            id="vehicle"
            value={vehicleInfo.vehicle}
            onChange={(e) => onVehicleChange(e.target.value)}
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
          onChange={onEtaChange}
          className="col-span-3"
        />
      </div>
    </>
  );
};
