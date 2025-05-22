
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RequestStatusBadge } from "@/components/RequestStatusBadge";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { RequestStatus } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { RequireAuth } from "@/components/RequireAuth";
import { Separator } from "@/components/ui/separator";

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getRequestById, updateRequestStatus } = useRequests();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [vehicleInfo, setVehicleInfo] = useState({
    vehicle: "",
    eta: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus | null>(null);
  
  if (!id) {
    navigate('/solicitudes');
    return null;
  }
  
  const request = getRequestById(id);
  
  if (!request) {
    navigate('/solicitudes');
    return null;
  }
  
  const handleStatusUpdate = (status: RequestStatus) => {
    if (status === 'assigned' || status === 'inRoute') {
      setNewStatus(status);
      setDialogOpen(true);
    } else {
      updateStatus(status);
    }
  };
  
  const updateStatus = (status: RequestStatus) => {
    setIsUpdating(true);
    try {
      if (status === 'assigned' || status === 'inRoute') {
        updateRequestStatus(id, status, {
          vehicle: vehicleInfo.vehicle,
          eta: vehicleInfo.eta
        });
      } else {
        updateRequestStatus(id, status);
      }
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la solicitud",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const canUpdateStatus = user?.role === 'ambulance' || user?.role === 'admin';
  const statusOptions = {
    pending: ['assigned', 'cancelled'],
    assigned: ['inRoute', 'cancelled'],
    inRoute: ['completed', 'cancelled'],
    completed: [],
    cancelled: ['pending']
  };
  
  const availableStatusChanges = statusOptions[request.status] || [];
  
  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" /> Volver
              </Button>
              <h1 className="text-2xl font-bold">Detalles de Solicitud</h1>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <CardTitle className="text-xl">
                      Solicitud #{request.id}
                    </CardTitle>
                    <CardDescription>
                      Creada: {formatDateTime(request.dateTime)}
                    </CardDescription>
                  </div>
                  <RequestStatusBadge status={request.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Información del Paciente</h3>
                    <Separator className="my-2" />
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Nombre completo</Label>
                        <p className="font-medium">{request.patientName}</p>
                      </div>
                      <div>
                        <Label className="text-xs">DNI/NIE o SS</Label>
                        <p className="font-medium">{request.patientId}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Detalles del Traslado</h3>
                    <Separator className="my-2" />
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Origen</Label>
                        <p className="font-medium">{request.origin}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Destino</Label>
                        <p className="font-medium">{request.destination}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Fecha y Tipo</h3>
                    <Separator className="my-2" />
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Fecha y hora programada</Label>
                        <p className="font-medium">{formatDateTime(request.dateTime)}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Tipo de transporte</Label>
                        <p className="font-medium">
                          {request.transportType === 'stretcher' ? 'Camilla' : 
                           request.transportType === 'wheelchair' ? 'Silla de ruedas' : 'Andando'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Responsable</h3>
                    <Separator className="my-2" />
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">Responsable del traslado</Label>
                        <p className="font-medium">{request.responsiblePerson}</p>
                      </div>
                      {request.authorizationFile && (
                        <div>
                          <Label className="text-xs">Autorización médica</Label>
                          <p className="font-medium text-primary-blue">
                            {request.authorizationFile}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {request.observations && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Observaciones</h3>
                    <Separator className="my-2" />
                    <p>{request.observations}</p>
                  </div>
                )}
                
                {(request.status === 'assigned' || request.status === 'inRoute') && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Información de la Ambulancia</h3>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Vehículo Asignado</Label>
                        <p className="font-medium">{request.assignedVehicle}</p>
                      </div>
                      {request.estimatedArrival && (
                        <div>
                          <Label className="text-xs">Hora estimada de llegada</Label>
                          <p className="font-medium">{formatDateTime(request.estimatedArrival)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              {canUpdateStatus && availableStatusChanges.length > 0 && (
                <CardFooter className="flex justify-end space-x-2">
                  {availableStatusChanges.includes('assigned') && (
                    <Button onClick={() => handleStatusUpdate('assigned')}>
                      Asignar Vehículo
                    </Button>
                  )}
                  
                  {availableStatusChanges.includes('inRoute') && (
                    <Button onClick={() => handleStatusUpdate('inRoute')}>
                      En Camino
                    </Button>
                  )}
                  
                  {availableStatusChanges.includes('completed') && (
                    <Button onClick={() => handleStatusUpdate('completed')}>
                      Completar
                    </Button>
                  )}
                  
                  {availableStatusChanges.includes('cancelled') && (
                    <Button variant="destructive" onClick={() => handleStatusUpdate('cancelled')}>
                      Cancelar
                    </Button>
                  )}
                  
                  {availableStatusChanges.includes('pending') && (
                    <Button variant="outline" onClick={() => handleStatusUpdate('pending')}>
                      Reactivar
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          </div>
        </main>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                  onChange={(e) => setVehicleInfo(prev => ({ ...prev, vehicle: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eta">Hora estimada de llegada</Label>
                <Input 
                  id="eta"
                  type="datetime-local"
                  value={vehicleInfo.eta}
                  onChange={(e) => setVehicleInfo(prev => ({ ...prev, eta: e.target.value }))}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => newStatus && updateStatus(newStatus)}
                disabled={!vehicleInfo.vehicle || !vehicleInfo.eta || isUpdating}
              >
                {isUpdating ? "Actualizando..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </RequireAuth>
  );
};

export default RequestDetail;
