
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface VehicleInfoProps {
  vehicle: string;
  estimatedArrival?: string;
  formatDateTime: (date: string) => string;
}

export const VehicleInfo = ({ vehicle, estimatedArrival, formatDateTime }: VehicleInfoProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">Información de la Ambulancia</h3>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs">Vehículo Asignado</Label>
          <p className="font-medium">{vehicle}</p>
        </div>
        {estimatedArrival && (
          <div>
            <Label className="text-xs">Hora estimada de llegada</Label>
            <p className="font-medium">{formatDateTime(estimatedArrival)}</p>
          </div>
        )}
      </div>
    </div>
  );
};
