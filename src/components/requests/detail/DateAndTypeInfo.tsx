
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface DateAndTypeInfoProps {
  dateTime: string;
  transportType: 'stretcher' | 'wheelchair' | 'walking';
  formatDateTime: (date: string) => string;
}

export const DateAndTypeInfo = ({ dateTime, transportType, formatDateTime }: DateAndTypeInfoProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">Fecha y Tipo</h3>
      <Separator className="my-2" />
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Fecha y hora programada</Label>
          <p className="font-medium">{formatDateTime(dateTime)}</p>
        </div>
        <div>
          <Label className="text-xs">Tipo de transporte</Label>
          <p className="font-medium">
            {transportType === 'stretcher' ? 'Camilla' : 
             transportType === 'wheelchair' ? 'Silla de ruedas' : 'Andando'}
          </p>
        </div>
      </div>
    </div>
  );
};
