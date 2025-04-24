
import React, { createContext, useContext, useState } from 'react';
import { TransportRequest, RequestStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface RequestsContextType {
  requests: TransportRequest[];
  addRequest: (request: Omit<TransportRequest, 'id' | 'status'>) => void;
  updateRequestStatus: (id: string, status: RequestStatus, vehicleInfo?: { vehicle: string, eta?: string }) => void;
  getRequestById: (id: string) => TransportRequest | undefined;
  filteredRequests: (status?: RequestStatus) => TransportRequest[];
}

// Mock data for demonstration
const initialRequests: TransportRequest[] = [
  {
    id: '1',
    patientName: 'Juan Pérez',
    patientId: '12345678A',
    origin: 'Hospital General',
    destination: 'Residencia Mayores Las Flores',
    responsiblePerson: 'Dr. Martínez',
    dateTime: '2025-04-25T10:30',
    transportType: 'stretcher',
    observations: 'Paciente con movilidad reducida',
    status: 'pending',
    createdBy: '2',
  },
  {
    id: '2',
    patientName: 'Ana Gómez',
    patientId: '87654321B',
    origin: 'Clínica Santa María',
    destination: 'Domicilio - Calle Real 42',
    responsiblePerson: 'Dra. López',
    dateTime: '2025-04-25T12:00',
    transportType: 'wheelchair',
    observations: 'Necesita ayuda para salir del vehículo',
    status: 'assigned',
    createdBy: '2',
    assignedVehicle: 'Ambulancia 047',
    estimatedArrival: '2025-04-25T11:45'
  },
  {
    id: '3',
    patientName: 'Carlos Ruiz',
    patientId: '45678912C',
    origin: 'Centro de Salud Norte',
    destination: 'Hospital Universitario',
    responsiblePerson: 'Dr. Santos',
    dateTime: '2025-04-25T15:15',
    transportType: 'walking',
    observations: 'Cita en Radiología',
    status: 'inRoute',
    createdBy: '3',
    assignedVehicle: 'Ambulancia 023',
    estimatedArrival: '2025-04-25T15:00'
  }
];

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<TransportRequest[]>(initialRequests);
  const { toast } = useToast();

  const addRequest = (newRequest: Omit<TransportRequest, 'id' | 'status'>) => {
    const request: TransportRequest = {
      ...newRequest,
      id: Date.now().toString(),
      status: 'pending',
    };

    setRequests(prev => [...prev, request]);
    
    toast({
      title: "Solicitud creada",
      description: "La solicitud de transporte ha sido enviada correctamente.",
    });
  };

  const updateRequestStatus = (id: string, status: RequestStatus, vehicleInfo?: { vehicle: string, eta?: string }) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { 
              ...request, 
              status,
              ...(vehicleInfo ? { 
                assignedVehicle: vehicleInfo.vehicle,
                estimatedArrival: vehicleInfo.eta
              } : {})
            } 
          : request
      )
    );
    
    const statusMessages = {
      pending: "La solicitud está pendiente de asignación",
      assigned: "Se ha asignado un vehículo a la solicitud",
      inRoute: "El vehículo está en camino",
      completed: "El traslado ha sido completado",
      cancelled: "La solicitud ha sido cancelada"
    };
    
    toast({
      title: "Estado actualizado",
      description: statusMessages[status],
      variant: status === 'cancelled' ? "destructive" : "default",
    });
  };

  const getRequestById = (id: string) => {
    return requests.find(request => request.id === id);
  };

  const filteredRequests = (status?: RequestStatus) => {
    if (!status) return requests;
    return requests.filter(request => request.status === status);
  };

  return (
    <RequestsContext.Provider value={{ requests, addRequest, updateRequestStatus, getRequestById, filteredRequests }}>
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error('useRequests debe usarse dentro de un RequestsProvider');
  }
  return context;
};
