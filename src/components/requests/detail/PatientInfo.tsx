
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PatientInfoProps {
  name: string;
  id: string;
}

export const PatientInfo = ({ name, id }: PatientInfoProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">Información del Paciente</h3>
      <Separator className="my-2" />
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Nombre completo</Label>
          <p className="font-medium">{name}</p>
        </div>
        <div>
          <Label className="text-xs">DNI/NIE o SS</Label>
          <p className="font-medium">{id}</p>
        </div>
      </div>
    </div>
  );
};
