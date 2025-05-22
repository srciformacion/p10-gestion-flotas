
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TransportInfoProps {
  origin: string;
  destination: string;
}

export const TransportInfo = ({ origin, destination }: TransportInfoProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">Detalles del Traslado</h3>
      <Separator className="my-2" />
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Origen</Label>
          <p className="font-medium">{origin}</p>
        </div>
        <div>
          <Label className="text-xs">Destino</Label>
          <p className="font-medium">{destination}</p>
        </div>
      </div>
    </div>
  );
};
