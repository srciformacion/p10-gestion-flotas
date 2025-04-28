
import { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { RequestStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { RequireAuth } from "@/components/RequireAuth";
import { RequestStatusBadge } from "@/components/RequestStatusBadge";
import { PatientInfo } from "@/components/requests/detail/PatientInfo";
import { TransportInfo } from "@/components/requests/detail/TransportInfo";
import { DateAndTypeInfo } from "@/components/requests/detail/DateAndTypeInfo";
import { ResponsibleInfo } from "@/components/requests/detail/ResponsibleInfo";
import { VehicleInfo } from "@/components/requests/detail/VehicleInfo";
import { StatusUpdateDialog } from "@/components/requests/detail/StatusUpdateDialog";

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getRequestById, updateRequestStatus } = useRequests();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<ReturnType<typeof getRequestById>>(undefined);
  const [vehicleInfo, setVehicleInfo] = useState({
    vehicle: "",
    eta: ""
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<RequestStatus | null>(null);
  
  // Fetch request data initially and when ID changes
  useEffect(() => {
    if (!id) {
      navigate('/solicitudes');
      return;
    }
    
    const requestData = getRequestById(id);
    if (!requestData) {
      navigate('/solicitudes');
      return;
    }
    
    setRequest(requestData);
    
    if (requestData.assignedVehicle) {
      setVehicleInfo({
        vehicle: requestData.assignedVehicle,
        eta: requestData.estimatedArrival || ''
      });
    }
  }, [id, getRequestById, navigate]);
  
  // Redirect if no valid request
  if (!id || !request) {
    return null;
  }

  // Memoized date formatting function
  const formatDateTime = useCallback((dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  }, []);
  
  const handleStatusUpdate = useCallback((status: RequestStatus) => {
    if (status === 'assigned' || status === 'inRoute') {
      setNewStatus(status);
      setDialogOpen(true);
    } else {
      updateStatus(status);
    }
  }, []);
  
  const updateStatus = async (status: RequestStatus) => {
    if (!id) return;
    
    setIsUpdating(true);
    try {
      let updatedRequest;
      if (status === 'assigned' || status === 'inRoute') {
        updatedRequest = await updateRequestStatus(id, status, {
          assignedVehicle: vehicleInfo.vehicle,
          estimatedArrival: vehicleInfo.eta
        });
      } else {
        updatedRequest = await updateRequestStatus(id, status);
      }
      
      // Update local state with new data
      if (updatedRequest) {
        setRequest(updatedRequest);
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
  
  // Memoize permission checks and available status changes
  const canUpdateStatus = useMemo(() => 
    user?.role === 'ambulance' || user?.role === 'admin',
  [user]);
  
  const statusOptions = useMemo(() => ({
    pending: ['assigned', 'cancelled'],
    assigned: ['inRoute', 'cancelled'],
    inRoute: ['completed', 'cancelled'],
    completed: [],
    cancelled: ['pending']
  }), []);
  
  const availableStatusChanges = useMemo(() => 
    statusOptions[request.status] || [],
  [statusOptions, request.status]);

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
                  <VehicleInfo 
                    vehicle={request.assignedVehicle || ''}
                    estimatedArrival={request.estimatedArrival}
                    formatDateTime={formatDateTime}
                  />
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
        />
      </div>
    </RequireAuth>
  );
};

export default RequestDetail;
