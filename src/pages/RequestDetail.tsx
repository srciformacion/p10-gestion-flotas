import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { RequestStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { RequireAuth } from "@/components/RequireAuth";
import { RequestStatusBadge } from "@/components/RequestStatusBadge";
import { PatientInfo } from "@/components/requests/detail/PatientInfo";
import { TransportInfo } from "@/components/requests/detail/TransportInfo";
import { DateAndTypeInfo } from "@/components/requests/detail/DateAndTypeInfo";
import { ResponsibleInfo } from "@/components/requests/detail/ResponsibleInfo";
import { VehicleInfo } from "@/components/requests/detail/VehicleInfo";
import { EnhancedVehicleInfo } from "@/components/requests/detail/EnhancedVehicleInfo";
import { StatusUpdateDialog } from "@/components/requests/detail/StatusUpdateDialog";
import { ReassignVehicleDialog } from "@/components/requests/ReassignVehicleDialog";
import { VehicleDetails } from "@/types/vehicle";

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getRequestById, updateRequestStatus, requests, isLoading } = useRequests();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [vehicleInfo, setVehicleInfo] = useState({
    vehicle: "",
    eta: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reassignDialogOpen, setReassignDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);
  
  console.log('RequestDetail - ID from params:', id);
  console.log('RequestDetail - Total requests:', requests.length);
  console.log('RequestDetail - Is loading:', isLoading);
  
  if (!id) {
    console.log('No ID provided, navigating to requests list');
    navigate('/solicitudes');
    return null;
  }
  
  const request = getRequestById(id);
  console.log('RequestDetail - Found request:', request);
  
  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Cargando solicitud...</h2>
                  <p className="text-muted-foreground">Por favor espere</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </RequireAuth>
    );
  }
  
  if (!request) {
    console.log('Request not found, navigating to requests list');
    return (
      <RequireAuth>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Solicitud no encontrada</h2>
                  <p className="text-muted-foreground mb-4">La solicitud con ID {id} no existe</p>
                  <Button onClick={() => navigate('/solicitudes')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a solicitudes
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </RequireAuth>
    );
  }

  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const handleStatusUpdate = (status: RequestStatus) => {
    if (status === 'assigned' || status === 'inRoute') {
      setNewStatus(status);
      setDialogOpen(true);
    } else {
      updateStatus(status);
    }
  };
  
  const updateStatus = async (status: RequestStatus) => {
    setIsUpdating(true);
    try {
      if (status === 'assigned' || status === 'inRoute') {
        await updateRequestStatus(id, status, {
          assignedVehicle: vehicleInfo.vehicle,
          estimatedArrival: vehicleInfo.eta
        });
      } else {
        await updateRequestStatus(id, status);
      }
      setDialogOpen(false);
      toast({
        title: "Estado actualizado",
        description: "El estado de la solicitud se ha actualizado correctamente",
      });
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
  const canReassignVehicle = (user?.role === 'admin' || user?.role === 'ambulance') && 
                            (request.status === 'assigned' || request.status === 'inRoute') &&
                            request.assignedVehicle;
  
  const statusOptions = {
    pending: ['assigned', 'cancelled'],
    assigned: ['inRoute', 'cancelled'],
    inRoute: ['completed', 'cancelled'],
    completed: [],
    cancelled: ['pending']
  };
  
  const availableStatusChanges = statusOptions[request.status] || [];

  const handleVehicleSelect = (vehicle: VehicleDetails, eta: string) => {
    setSelectedVehicle(vehicle);
    setVehicleInfo({ vehicle: `${vehicle.vehicleId} - ${vehicle.licensePlate}`, eta });
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
                  <div className="flex items-center gap-2">
                    <RequestStatusBadge status={request.status} />
                    {canReassignVehicle && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setReassignDialogOpen(true)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reasignar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                  <PatientInfo name={request.patientName} id={request.patientId} />
                  <TransportInfo origin={request.origin} destination={request.destination} />
                  <DateAndTypeInfo 
                    dateTime={request.dateTime}
                    transportType={request.transportType}
                    formatDateTime={formatDateTime}
                  />
                  <ResponsibleInfo 
                    responsiblePerson={request.responsiblePerson}
                    authorizationFile={request.authorizationFile}
                  />
                </div>
                
                {request.observations && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Observaciones</h3>
                    <p>{request.observations}</p>
                  </div>
                )}
                
                {(request.status === 'assigned' || request.status === 'inRoute') && (
                  selectedVehicle ? (
                    <EnhancedVehicleInfo 
                      vehicle={selectedVehicle}
                      estimatedArrival={request.estimatedArrival}
                      formatDateTime={formatDateTime}
                    />
                  ) : (
                    <VehicleInfo 
                      vehicle={request.assignedVehicle || ''}
                      estimatedArrival={request.estimatedArrival}
                      formatDateTime={formatDateTime}
                    />
                  )
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
        
        <StatusUpdateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          vehicleInfo={vehicleInfo}
          onVehicleInfoChange={setVehicleInfo}
          onConfirm={() => newStatus && updateStatus(newStatus)}
          isUpdating={isUpdating}
          newStatus={newStatus === 'assigned' || newStatus === 'inRoute' ? newStatus : null}
          onVehicleSelect={handleVehicleSelect}
        />

        <ReassignVehicleDialog
          open={reassignDialogOpen}
          onOpenChange={setReassignDialogOpen}
          request={request}
        />
      </div>
    </RequireAuth>
  );
};

export default RequestDetail;
