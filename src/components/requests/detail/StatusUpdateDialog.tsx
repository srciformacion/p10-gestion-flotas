
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleInfo: {
    vehicle: string;
    eta: string;
  };
  onVehicleInfoChange: (info: { vehicle: string; eta: string }) => void;
  onConfirm: () => void;
  isUpdating: boolean;
  newStatus: 'assigned' | 'inRoute' | null;
}

export const StatusUpdateDialog = ({
  open,
  onOpenChange,
  vehicleInfo,
  onVehicleInfoChange,
  onConfirm,
  isUpdating,
  newStatus
}: StatusUpdateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {newStatus === 'assigned' ? 'Asignar Vehículo' : 'Iniciar Traslado'}
          </DialogTitle>
          <DialogDescription>
            Ingrese la información del vehículo y la hora estimada de llegada
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehículo</Label>
            <Input 
              id="vehicle"
              placeholder="Ej: Ambulancia 047"
              value={vehicleInfo.vehicle}
              onChange={(e) => onVehicleInfoChange({ ...vehicleInfo, vehicle: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="eta">Hora estimada de llegada</Label>
            <Input 
              id="eta"
              type="datetime-local"
              value={vehicleInfo.eta}
              onChange={(e) => onVehicleInfoChange({ ...vehicleInfo, eta: e.target.value })}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={!vehicleInfo.vehicle || !vehicleInfo.eta || isUpdating}
          >
            {isUpdating ? "Actualizando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
