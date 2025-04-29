
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRequests } from "@/context/requests";
import { useToast } from "@/hooks/use-toast";
import { RequestStatus } from "@/types";

export const useRequestDetail = (id?: string) => {
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

  const loadRequest = useCallback(() => {
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
      if (status === 'assigned' || status === 'inRoute') {
        await updateRequestStatus(id, status, {
          assignedVehicle: vehicleInfo.vehicle,
          estimatedArrival: vehicleInfo.eta
        });
      } else {
        await updateRequestStatus(id, status);
      }
      
      const updatedRequest = getRequestById(id);
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

  const statusOptions = useMemo(() => ({
    pending: ['assigned', 'cancelled'],
    assigned: ['inRoute', 'cancelled'],
    inRoute: ['completed', 'cancelled'],
    completed: [],
    cancelled: ['pending']
  }), []);

  const availableStatusChanges = useMemo(() => 
    request ? statusOptions[request.status] || [] : [],
  [statusOptions, request]);

  return {
    request,
    vehicleInfo,
    setVehicleInfo,
    isUpdating,
    dialogOpen,
    setDialogOpen,
    newStatus,
    availableStatusChanges,
    formatDateTime,
    handleStatusUpdate,
    updateStatus,
    loadRequest
  };
};
