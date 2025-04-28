
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface TransportTypeSectionProps {
  transportType: "stretcher" | "wheelchair" | "walking";
  onValueChange: (value: "stretcher" | "wheelchair" | "walking") => void;
}

export const TransportTypeSection = ({
  transportType,
  onValueChange,
}: TransportTypeSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Medio requerido *</Label>
      <RadioGroup 
        value={transportType} 
        onValueChange={onValueChange}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="stretcher" id="stretcher" />
          <Label htmlFor="stretcher">Camilla</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="wheelchair" id="wheelchair" />
          <Label htmlFor="wheelchair">Silla de ruedas</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="walking" id="walking" />
          <Label htmlFor="walking">Andando</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
