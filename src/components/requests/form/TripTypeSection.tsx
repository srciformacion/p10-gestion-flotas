
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TripType } from "@/types";
import { CalendarClock } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TripTypeSectionProps {
  tripType: TripType;
  onValueChange: (value: TripType) => void;
  returnDateTime?: string;
  onReturnDateTimeChange?: (value: string) => void;
}

export const TripTypeSection = ({
  tripType,
  onValueChange,
  returnDateTime,
  onReturnDateTimeChange,
}: TripTypeSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          <Label>Tipo de traslado *</Label>
        </div>
        
        <RadioGroup 
          value={tripType} 
          onValueChange={onValueChange}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
            <RadioGroupItem value="oneWay" id="oneWay" />
            <Label htmlFor="oneWay" className="cursor-pointer">Solo ida</Label>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted">
            <RadioGroupItem value="roundTrip" id="roundTrip" />
            <Label htmlFor="roundTrip" className="cursor-pointer">Ida y vuelta</Label>
          </div>
        </RadioGroup>
      </div>

      {tripType === "roundTrip" && (
        <div className="space-y-2">
          <Label htmlFor="returnDateTime">Fecha y hora de retorno *</Label>
          <Input
            id="returnDateTime"
            type="datetime-local"
            value={returnDateTime}
            onChange={(e) => onReturnDateTimeChange?.(e.target.value)}
            className="w-full"
            required
          />
        </div>
      )}
    </div>
  );
};
