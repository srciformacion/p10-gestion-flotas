
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TripType } from "@/types";

interface TripTypeSectionProps {
  tripType: TripType;
  onValueChange: (value: TripType) => void;
}

export const TripTypeSection = ({
  tripType,
  onValueChange,
}: TripTypeSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Tipo de traslado *</Label>
      <RadioGroup 
        value={tripType} 
        onValueChange={onValueChange}
        className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="oneWay" id="oneWay" />
          <Label htmlFor="oneWay">Solo ida</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="roundTrip" id="roundTrip" />
          <Label htmlFor="roundTrip">Ida y vuelta</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
