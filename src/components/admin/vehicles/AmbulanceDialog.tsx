
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AmbulanceForm } from "./AmbulanceForm";
import { Ambulance } from "@/types";
import { toast } from "sonner";

interface AmbulanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ambulance: Partial<Ambulance>;
  isEditing: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
  onFieldChange: (field: keyof Ambulance, value: any) => void;
  onEquipmentToggle: (equipmentId: string) => void;
}

export const AmbulanceDialog = ({
  open,
  onOpenChange,
  ambulance,
  isEditing,
  onSubmit,
  isSubmitting,
  onFieldChange,
  onEquipmentToggle,
}: AmbulanceDialogProps) => {
  const handleSubmit = () => {
    if (!ambulance.licensePlate || !ambulance.model || !ambulance.baseLocation) {
      toast.error("Por favor, complete los campos obligatorios");
      return;
    }
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Ambulancia" : "Añadir Nueva Ambulancia"}
          </DialogTitle>
          <DialogDescription>
            Complete todos los campos obligatorios para {isEditing ? "actualizar" : "añadir"} la ambulancia.
          </DialogDescription>
        </DialogHeader>
        
        <AmbulanceForm
          ambulance={ambulance}
          isEditing={isEditing}
          onFieldChange={onFieldChange}
          onEquipmentToggle={onEquipmentToggle}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
