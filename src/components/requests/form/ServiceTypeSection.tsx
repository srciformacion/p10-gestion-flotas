
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ServiceType } from "@/types";

interface ServiceTypeSectionProps {
  serviceType: ServiceType;
  onValueChange: (value: ServiceType) => void;
}

export const ServiceTypeSection = ({
  serviceType,
  onValueChange,
}: ServiceTypeSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Tipo de servicio *</Label>
      <RadioGroup 
        value={serviceType} 
        onValueChange={onValueChange}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="consultation" id="consultation" />
          <Label htmlFor="consultation">Consulta</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="admission" id="admission" />
          <Label htmlFor="admission">Ingreso</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="discharge" id="discharge" />
          <Label htmlFor="discharge">Alta</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="transfer" id="transfer" />
          <Label htmlFor="transfer">Traslado entre centros</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
