
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface EquipmentSectionProps {
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string, checked: boolean) => void;
}

export const EquipmentSection = ({
  selectedEquipment,
  onEquipmentChange,
}: EquipmentSectionProps) => {
  // List of available equipment options
  const equipmentOptions = [
    { id: "oxygen", label: "Oxígeno" },
    { id: "stair-chair", label: "Silla oruga para escaleras" },
    { id: "monitor", label: "Monitor de constantes" },
    { id: "defibrillator", label: "Desfibrilador" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label>Equipamiento especial requerido</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Seleccione todo el equipamiento necesario para el traslado
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {equipmentOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`equipment-${option.id}`}
              checked={selectedEquipment.includes(option.id)}
              onCheckedChange={(checked) => 
                onEquipmentChange(option.id, checked === true)
              }
            />
            <Label htmlFor={`equipment-${option.id}`} className="text-sm font-normal">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
