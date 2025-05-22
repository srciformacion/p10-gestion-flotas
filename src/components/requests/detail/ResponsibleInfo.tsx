
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ResponsibleInfoProps {
  responsiblePerson: string;
  authorizationFile?: string;
}

export const ResponsibleInfo = ({ responsiblePerson, authorizationFile }: ResponsibleInfoProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">Responsable</h3>
      <Separator className="my-2" />
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Responsable del traslado</Label>
          <p className="font-medium">{responsiblePerson}</p>
        </div>
        {authorizationFile && (
          <div>
            <Label className="text-xs">Autorización médica</Label>
            <p className="font-medium text-primary-blue">
              {authorizationFile}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
