
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";
import { RecurrenceType } from "@/types";

interface RecurrenceSectionProps {
  recurrenceType: RecurrenceType;
  startDate: string;
  endDate: string;
  weekdays: string[];
  pickupTime: string;
  returnTime?: string;
  excludeHolidays: boolean;
  onRecurrenceTypeChange: (value: RecurrenceType) => void;
  onWeekdayChange: (day: string, checked: boolean) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RecurrenceSection = ({
  recurrenceType,
  startDate,
  endDate,
  weekdays,
  pickupTime,
  returnTime,
  excludeHolidays,
  onRecurrenceTypeChange,
  onWeekdayChange,
  onChange
}: RecurrenceSectionProps) => {
  const weekdayOptions = [
    { id: "monday", label: "Lunes" },
    { id: "tuesday", label: "Martes" },
    { id: "wednesday", label: "Miércoles" },
    { id: "thursday", label: "Jueves" },
    { id: "friday", label: "Viernes" }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base">Modo de programación *</Label>
        <RadioGroup
          value={recurrenceType}
          onValueChange={(value) => onRecurrenceTypeChange(value as RecurrenceType)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="dateRange" id="dateRange" />
            <Label htmlFor="dateRange" className="cursor-pointer flex-1">
              <div className="font-medium">Rango de fechas</div>
              <div className="text-sm text-muted-foreground">Solo días laborables entre dos fechas</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly" className="cursor-pointer flex-1">
              <div className="font-medium">Recurrencia semanal</div>
              <div className="text-sm text-muted-foreground">Mismos días de la semana durante un periodo</div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Fecha de inicio *</Label>
          <div className="relative">
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={startDate}
              onChange={onChange}
              required
            />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Fecha de fin *</Label>
          <div className="relative">
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={endDate}
              onChange={onChange}
              required
            />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>
      
      {recurrenceType === 'weekly' && (
        <div className="space-y-3">
          <Label>Días de la semana *</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {weekdayOptions.map((day) => (
              <div key={day.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={day.id}
                  checked={weekdays.includes(day.id)}
                  onCheckedChange={(checked) => onWeekdayChange(day.id, checked === true)}
                />
                <Label htmlFor={day.id} className="cursor-pointer">{day.label}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pickupTime">Hora de recogida *</Label>
          <Input
            id="pickupTime"
            name="pickupTime"
            type="time"
            value={pickupTime}
            onChange={onChange}
            required
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="excludeHolidays"
          name="excludeHolidays"
          checked={excludeHolidays}
          onCheckedChange={(checked) => {
            const event = {
              target: {
                name: "excludeHolidays",
                value: checked === true ? "true" : "false"
              }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(event);
          }}
        />
        <Label htmlFor="excludeHolidays" className="cursor-pointer">
          Excluir días festivos
        </Label>
      </div>
    </div>
  );
};
