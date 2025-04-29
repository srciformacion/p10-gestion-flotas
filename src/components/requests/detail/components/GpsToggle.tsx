
import React from "react";
import { Label } from "@/components/ui/label";

interface GpsToggleProps {
  useGps: boolean;
  setUseGps: (useGps: boolean) => void;
}

export const GpsToggle = ({ useGps, setUseGps }: GpsToggleProps) => {
  return (
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
  );
};
