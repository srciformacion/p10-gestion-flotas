
import { useState, useEffect } from "react";
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
import { Ambulance } from "@/types";
import { toast } from "sonner";
import { useRequests } from "@/context/RequestsContext";
import { ambulancesApi } from "@/services/api/ambulances";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const [availableAmbulances, setAvailableAmbulances] = useState<Ambulance[]>([]);
  const [assignmentConflict, setAssignmentConflict] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("automatic");
  
  const { 
    updateRequestStatus, 
    getRequestById,
    assignVehicleAutomatically,
    checkForAssignmentConflicts 
  } = useRequests();

  // Load available ambulances when the dialog opens
  useEffect(() => {
    if (!open) return;
    
    const loadAmbulances = async () => {
      try {
        const ambulances = await ambulancesApi.getAll();
        setAvailableAmbulances(ambulances.filter(amb => amb.status === 'available'));
      } catch (error) {
        console.error("Error loading ambulances:", error);
        toast.error("Error al cargar ambulancias disponibles");
      }
    };
    
    loadAmbulances();
  }, [open]);

  // Check for conflicts when vehicle selection changes
  useEffect(() => {
    if (!vehicle || !open) return;
    
    const checkConflicts = async () => {
      const request = getRequestById(requestId);
      if (!request) return;
      
      const hasConflict = await checkForAssignmentConflicts(
        requestId, 
        vehicle, 
        request.dateTime
      );
      
      setAssignmentConflict(hasConflict);
    };
    
    checkConflicts();
  }, [vehicle, requestId, checkForAssignmentConflicts, getRequestById, open]);

  const handleManualAssign = async () => {
    if (!vehicle) {
      toast.error("Debe seleccionar un vehículo");
      return;
    }

    setIsSubmitting(true);
    try {
      // Check for conflicts before assigning
      const request = getRequestById(requestId);
      if (request) {
        const hasConflict = await checkForAssignmentConflicts(
          requestId, 
          vehicle, 
          request.dateTime
        );
        
        if (hasConflict) {
          toast.error("Hay conflictos de programación con este vehículo", {
            description: "Seleccione otro vehículo o ajuste el horario de la solicitud"
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      // Actualizamos el estado de la solicitud a "assigned" y asignamos el vehículo
      await updateRequestStatus(requestId, "assigned", {
        assignedVehicle: vehicle,
        estimatedArrival: estimatedArrival || undefined
      });
      
      // Update ambulance status
      await ambulancesApi.update(vehicle, { status: 'busy' });
      
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

  const handleAutoAssign = async () => {
    setIsAutoAssigning(true);
    try {
      const assignment = await assignVehicleAutomatically(requestId);
      
      if (assignment) {
        toast.success("Asignación automática exitosa", {
          description: `Se ha asignado el vehículo ${assignment.ambulanceId} a la solicitud`
        });
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast.error("No se encontró un vehículo adecuado", {
          description: "Intente la asignación manual o revise los criterios de la solicitud"
        });
      }
    } catch (error) {
      toast.error("Error en la asignación automática");
      console.error("Error en asignación automática:", error);
    } finally {
      setIsAutoAssigning(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={currentVehicle ? "outline" : "default"}>
          {currentVehicle ? "Cambiar vehículo" : "Asignar vehículo"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar vehículo</DialogTitle>
          <DialogDescription>
            Elija entre asignación automática inteligente o asignación manual
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="automatic">Automática</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          
          <TabsContent value="automatic" className="py-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                La asignación automática inteligente encontrará el vehículo más adecuado 
                según el tipo de servicio, ubicación, equipamiento requerido y plazas disponibles.
              </p>
              
              <Button 
                onClick={handleAutoAssign} 
                disabled={isAutoAssigning} 
                className="w-full"
              >
                {isAutoAssigning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Asignando...
                  </>
                ) : (
                  "Asignar automáticamente"
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="py-4">
            <div className="grid gap-4">
              {assignmentConflict && (
                <Alert variant="destructive">
                  <AlertTitle>Conflicto detectado</AlertTitle>
                  <AlertDescription>
                    Este vehículo ya tiene asignados servicios que se solapan con el solicitado.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vehicle" className="text-right">
                  Vehículo
                </Label>
                <Select value={vehicle} onValueChange={setVehicle}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleccionar vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAmbulances.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.id} - {v.model} ({v.zone})
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
              
              {vehicle && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <p><strong>Información del vehículo:</strong></p>
                  {availableAmbulances.find(a => a.id === vehicle) && (
                    <ul className="list-disc pl-4 space-y-1">
                      <li>
                        Zona: {availableAmbulances.find(a => a.id === vehicle)?.zone}
                      </li>
                      <li>
                        Plazas: {availableAmbulances.find(a => a.id === vehicle)?.stretcherSeats} camilla,{" "}
                        {availableAmbulances.find(a => a.id === vehicle)?.wheelchairSeats} silla,{" "}
                        {availableAmbulances.find(a => a.id === vehicle)?.walkingSeats} andando
                      </li>
                      <li>
                        Equipamiento: {availableAmbulances.find(a => a.id === vehicle)?.equipment.join(", ") || "Ninguno"}
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                type="submit" 
                onClick={handleManualAssign} 
                disabled={isSubmitting || !vehicle || assignmentConflict}
              >
                {isSubmitting ? "Asignando..." : "Asignar"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
