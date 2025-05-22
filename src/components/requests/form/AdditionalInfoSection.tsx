
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoSectionProps {
  architecturalBarriers: string;
  specialAttention: string;
  observations: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const AdditionalInfoSection = ({
  architecturalBarriers,
  specialAttention,
  observations,
  onChange,
}: AdditionalInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="architecturalBarriers">Barreras arquitectónicas</Label>
        <Input
          id="architecturalBarriers"
          name="architecturalBarriers"
          placeholder="Escaleras, ascensor no operativo, etc."
          value={architecturalBarriers}
          onChange={onChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="specialAttention">Necesidades especiales</Label>
        <Input
          id="specialAttention"
          name="specialAttention"
          placeholder="Oxígeno, monitor, etc."
          value={specialAttention}
          onChange={onChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observations">Observaciones médicas adicionales</Label>
        <Textarea
          id="observations"
          name="observations"
          placeholder="Indique cualquier información relevante para el traslado"
          value={observations}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
