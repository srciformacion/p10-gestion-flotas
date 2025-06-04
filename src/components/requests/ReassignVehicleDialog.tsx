
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { VehicleSelector } from "@/components/requests/VehicleSelector";
import { VehicleDetails } from "@/types/vehicle";
import { TransportRequest } from "@/types/request";
import { useRequests } from "@/context/RequestsProvider";
import { useToast } from "@/hooks/use-toast";
import { Truck, Clock, AlertTriangle } from "lucide-react";

interface ReassignVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: TransportRequest;
}

export const ReassignVehicleDialog = ({ 
  open, 
  onOpenChange, 
  request 
}: ReassignVehicleDialogProps) => {
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);
  const [newEta, setNewEta] = useState("");
  const [reason, setReason] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { updateRequestStatus } = useRequests();
  const { toast } = useToast();

  const handleVehicleSelect = (vehicle: VehicleDetails, eta: string) => {
    setSelectedVehicle(vehicle);
    setNewEta(eta);
    setShowVehicleSelector(false);
  };

  const handleConfirmReassignment = async () => {
    if (!selectedVehicle || !reason.trim()) {
      toast({
        title: "Error",
        description: "Debe seleccionar un vehículo y proporcionar una razón",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateRequestStatus(request.id, request.status, {
        assignedVehicle: `${selectedVehicle.vehicleId} - ${selectedVehicle.licensePlate}`,
        estimatedArrival: newEta
      });

      // TODO: Aquí se registraría el historial de reasignación
      
      toast({
        title: "Vehículo reasignado",
        description: `Se ha asignado ${selectedVehicle.vehicleId} a la solicitud`,
      });
      
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo reasignar el vehículo",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const resetForm = () => {
    setSelectedVehicle(null);
    setNewEta("");
    setReason("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Reasignar Vehículo
            </DialogTitle>
            <DialogDescription>
              Solicitud #{request.id} - {request.patientName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Vehículo actual */}
            <div className="p-3 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Vehículo actual:</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  {request.assignedVehicle || "Sin asignar"}
                </Badge>
                {request.estimatedArrival && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    ETA: {new Date(request.estimatedArrival).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>

            {/* Nuevo vehículo */}
            <div className="space-y-2">
              <Label>Nuevo vehículo:</Label>
              {selectedVehicle ? (
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{selectedVehicle.vehicleId}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedVehicle.licensePlate} - {selectedVehicle.model}
                      </div>
                      {selectedVehicle.driver && (
                        <div className="text-sm text-muted-foreground">
                          Conductor: {selectedVehicle.driver.name}
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowVehicleSelector(true)}
                    >
                      Cambiar
                    </Button>
                  </div>
                  {newEta && (
                    <div className="flex items-center gap-1 mt-2 text-sm">
                      <Clock className="h-3 w-3" />
                      Nuevo ETA: {new Date(newEta).toLocaleString()}
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setShowVehicleSelector(true)}
                  className="w-full"
                >
                  Seleccionar vehículo
                </Button>
              )}
            </div>

            {/* Razón del cambio */}
            <div className="space-y-2">
              <Label htmlFor="reason">Razón de la reasignación *</Label>
              <Textarea
                id="reason"
                placeholder="Explique el motivo de la reasignación..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>

            {/* Advertencia */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                La reasignación notificará automáticamente a todos los involucrados 
                y se registrará en el historial de la solicitud.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmReassignment}
              disabled={!selectedVehicle || !reason.trim() || isUpdating}
            >
              {isUpdating ? "Reasignando..." : "Confirmar Reasignación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Selector de vehículo */}
      <VehicleSelector
        open={showVehicleSelector}
        onOpenChange={setShowVehicleSelector}
        onVehicleSelect={handleVehicleSelect}
        isUpdating={false}
      />
    </>
  );
};
