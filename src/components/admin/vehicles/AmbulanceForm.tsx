
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ambulance } from "@/types";
import { equipmentOptions } from "./constants";

interface AmbulanceFormProps {
  ambulance: Partial<Ambulance>;
  isEditing: boolean;
  onFieldChange: (field: keyof Ambulance, value: any) => void;
  onEquipmentToggle: (equipmentId: string) => void;
}

export const AmbulanceForm = ({
  ambulance,
  isEditing,
  onFieldChange,
  onEquipmentToggle,
}: AmbulanceFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="id">
          Identificador {isEditing && "(no modificable)"}
        </Label>
        <Input
          id="id"
          placeholder="Ej: A-101, SVB-Logroño-1"
          value={isEditing && "id" in ambulance ? ambulance.id : "Se generará automáticamente"}
          disabled={true}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="licensePlate" className="required">Matrícula</Label>
        <Input
          id="licensePlate"
          placeholder="Ej: 1234ABC"
          value={ambulance.licensePlate}
          onChange={(e) => onFieldChange("licensePlate", e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="model" className="required">Modelo</Label>
        <Input
          id="model"
          placeholder="Ej: Mercedes Sprinter"
          value={ambulance.model}
          onChange={(e) => onFieldChange("model", e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type" className="required">Tipo</Label>
        <Select
          value={ambulance.type}
          onValueChange={(value) => onFieldChange("type", value)}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="consultation">Transporte programado</SelectItem>
            <SelectItem value="emergency">Emergencias</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="baseLocation" className="required">Ubicación Base</Label>
        <Input
          id="baseLocation"
          placeholder="Ej: Logroño, Calahorra"
          value={ambulance.baseLocation}
          onChange={(e) => onFieldChange("baseLocation", e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="zone" className="required">Zona de operación</Label>
        <Input
          id="zone"
          placeholder="Ej: Logroño, Haro"
          value={ambulance.zone}
          onChange={(e) => onFieldChange("zone", e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status" className="required">Estado</Label>
        <Select
          value={ambulance.status}
          onValueChange={(value) => 
            onFieldChange("status", value as Ambulance['status'])
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="busy">Asignada a servicio</SelectItem>
            <SelectItem value="maintenance">En mantenimiento</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="required">Disponibilidad</Label>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hasMedicalBed" 
              checked={ambulance.hasMedicalBed} 
              onCheckedChange={(checked) => 
                onFieldChange("hasMedicalBed", Boolean(checked))
              }
            />
            <label htmlFor="hasMedicalBed">
              Tiene camilla
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hasWheelchair" 
              checked={ambulance.hasWheelchair} 
              onCheckedChange={(checked) => 
                onFieldChange("hasWheelchair", Boolean(checked))
              }
            />
            <label htmlFor="hasWheelchair">
              Tiene silla de ruedas
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="allowsWalking" 
              checked={ambulance.allowsWalking} 
              onCheckedChange={(checked) => 
                onFieldChange("allowsWalking", Boolean(checked))
              }
            />
            <label htmlFor="allowsWalking">
              Permite transporte andando/sentado
            </label>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="required">Capacidad máxima</Label>
          <div className="space-y-2">
            <div className="flex items-center">
              <label htmlFor="stretcherSeats" className="w-full">
                Pacientes en camilla:
              </label>
              <Input
                id="stretcherSeats"
                type="number"
                min="0"
                value={ambulance.stretcherSeats}
                onChange={(e) => onFieldChange("stretcherSeats", parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="wheelchairSeats" className="w-full">
                Pacientes en silla:
              </label>
              <Input
                id="wheelchairSeats"
                type="number"
                min="0"
                value={ambulance.wheelchairSeats}
                onChange={(e) => onFieldChange("wheelchairSeats", parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="walkingSeats" className="w-full">
                Pacientes andando:
              </label>
              <Input
                id="walkingSeats"
                type="number"
                min="0"
                value={ambulance.walkingSeats}
                onChange={(e) => onFieldChange("walkingSeats", parseInt(e.target.value) || 0)}
                className="w-20"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Equipamiento especial</Label>
          <div className="space-y-2">
            {equipmentOptions.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`equipment-${item.id}`}
                  checked={ambulance.equipment?.includes(item.id)}
                  onCheckedChange={() => onEquipmentToggle(item.id)}
                />
                <label htmlFor={`equipment-${item.id}`}>
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-2 space-y-2">
        <Label htmlFor="notes">Notas internas</Label>
        <Textarea
          id="notes"
          placeholder="Observaciones administrativas (opcional)"
          value={ambulance.notes || ""}
          onChange={(e) => onFieldChange("notes", e.target.value)}
        />
      </div>
    </div>
  );
};
