
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransportRequest } from "@/types";
import { toast } from "sonner";
import { useRequests } from "@/context/RequestsContext";

interface AssignVehicleDialogProps {
  requestId: string;
  currentVehicle?: string;
  onSuccess?: () => void;
}

export function AssignVehicleDialog({ requestId, currentVehicle, onSuccess }: AssignVehicleDialogProps) {
  const [open, setOpen] = useState(false);
  const [vehicle, setVehicle] = useState(currentVehicle || "");
  const [estimatedArrival, setEstimatedArrival] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateRequestStatus } = useRequests();

  // Lista simulada de vehículos disponibles
  const availableVehicles = [
    { id: "AMB-001", name: "Ambulancia 001" },
    { id: "AMB-002", name: "Ambulancia 002" },
    { id: "AMB-003", name: "Ambulancia 003" },
    { id: "AMB-004", name: "Ambulancia 004" },
  ];

  const handleSubmit = async () => {
    if (!vehicle) {
      toast.error("Debe seleccionar un vehículo");
      return;
    }

    setIsSubmitting(true);
    try {
      // Actualizamos el estado de la solicitud a "assigned" y asignamos el vehículo
      await updateRequestStatus(requestId, "assigned", {
        assignedVehicle: vehicle,
        estimatedArrival: estimatedArrival || undefined
      });
      
      toast.success("Vehículo asignado correctamente", {
        description: `Se ha asignado el vehículo ${vehicle} a la solicitud`
      });
      
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Error al asignar el vehículo");
      console.error("Error al asignar vehículo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={currentVehicle ? "outline" : "default"}>
          {currentVehicle ? "Cambiar vehículo" : "Asignar vehículo"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar vehículo</DialogTitle>
          <DialogDescription>
            Asigne un vehículo a esta solicitud y establezca la hora estimada de llegada
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vehicle" className="text-right">
              Vehículo
            </Label>
            <Select value={vehicle} onValueChange={setVehicle}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar vehículo" />
              </SelectTrigger>
              <SelectContent>
                {availableVehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="eta" className="text-right">
              ETA
            </Label>
            <Input
              id="eta"
              type="datetime-local"
              value={estimatedArrival}
              onChange={(e) => setEstimatedArrival(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Asignando..." : "Asignar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
