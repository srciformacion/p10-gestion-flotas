import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface PatientSectionProps {
  patientName: string;
  patientId: string;
  responsiblePerson: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const PatientSection = ({
  patientName,
  patientId,
  responsiblePerson,
  onChange
}: PatientSectionProps) => {
  return <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientName">Nombre del paciente *</Label>
          <Input id="patientName" name="patientName" value={patientName} onChange={onChange} required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="patientId">DNI/NIE o SS del paciente *</Label>
          <Input id="patientId" name="patientId" value={patientId} onChange={onChange} required />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="responsiblePerson">Servicio y/o Persona Responsable de la Petición *</Label>
        <Input id="responsiblePerson" name="responsiblePerson" placeholder="Médico, enfermero, etc." value={responsiblePerson} onChange={onChange} required />
      </div>
    </div>;
};