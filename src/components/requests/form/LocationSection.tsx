
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationSectionProps {
  origin: string;
  destination: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LocationSection = ({
  origin,
  destination,
  onChange,
}: LocationSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="origin">Centro de origen *</Label>
        <Input
          id="origin"
          name="origin"
          value={origin}
          onChange={onChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="destination">Destino *</Label>
        <Input
          id="destination"
          name="destination"
          value={destination}
          onChange={onChange}
          required
        />
      </div>
    </div>
  );
};
