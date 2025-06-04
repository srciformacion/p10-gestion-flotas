
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TransportRequest, RequestStatus } from '@/types/request';
import { mockServices } from '@/services/api/mock-services';
import { requestsApi } from '@/services/api/requests';
import { useNotifications } from '@/context/NotificationContext';

interface RequestsContextType {
  requests: TransportRequest[];
  isLoading: boolean;
  useMockData: boolean;
  setUseMockData: (useMockData: boolean) => void;
  loadRequests: () => Promise<void>;
  getRequestById: (id: string) => TransportRequest | undefined;
  createRequest: (request: Omit<TransportRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'type' | 'priority'>) => Promise<TransportRequest>;
  updateRequestStatus: (
    requestId: string,
    status: RequestStatus,
    additionalData?: { assignedVehicle?: string; estimatedArrival?: string }
  ) => Promise<TransportRequest>;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: React.ReactNode }) => {
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [useMockData]);

  const { addStatusUpdateNotification } = useNotifications();

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      if (useMockData) {
        setRequests(mockServices);
      } else {
        const requests = await requestsApi.getAll();
        setRequests(requests);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRequestById = (id: string): TransportRequest | undefined => {
    return requests.find(request => request.id === id);
  };

  const createRequest = async (request: Omit<TransportRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'type' | 'priority'>): Promise<TransportRequest> => {
    try {
      setIsLoading(true);
      let newRequest: TransportRequest;

      if (useMockData) {
        // Simular creación en mock data
        newRequest = {
          ...request,
          id: crypto.randomUUID(),
          status: 'pending',
          type: 'simple',
          priority: 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          observations: request.observations || ''
        };
        setRequests(prevRequests => [newRequest, ...prevRequests]);
      } else {
        // Llamar a la API para crear la solicitud
        newRequest = await requestsApi.create(request);
        setRequests(prevRequests => [newRequest, ...prevRequests]);
      }
      return newRequest;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequestStatus = async (
    requestId: string, 
    status: RequestStatus, 
    additionalData?: { assignedVehicle?: string; estimatedArrival?: string }
  ) => {
    try {
      const currentRequest = getRequestById(requestId);
      if (!currentRequest) {
        throw new Error('Solicitud no encontrada');
      }

      const oldStatus = currentRequest.status;
      
      const updatedRequest = {
        ...currentRequest,
        status,
        updatedAt: new Date().toISOString(),
        ...(additionalData?.assignedVehicle && { assignedVehicle: additionalData.assignedVehicle }),
        ...(additionalData?.estimatedArrival && { estimatedArrival: additionalData.estimatedArrival })
      };

      if (useMockData) {
        // Actualizar en el array de mock data
        const updatedMockData = mockServices.map(req => 
          req.id === requestId ? updatedRequest : req
        );
        setRequests(updatedMockData);
      } else {
        // Actualizar en localStorage
        const stored = localStorage.getItem('requests');
        const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
        const updatedRequests = requests.map(req => 
          req.id === requestId ? updatedRequest : req
        );
        localStorage.setItem('requests', JSON.stringify(updatedRequests));
        setRequests(updatedRequests);
      }

      // Generar notificación automática para el cambio de estado
      addStatusUpdateNotification(requestId, oldStatus, status);

      return updatedRequest;
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  };

  const value: RequestsContextType = {
    requests,
    isLoading,
    useMockData,
    setUseMockData,
    loadRequests,
    getRequestById,
    createRequest,
    updateRequestStatus
  };

  return (
    <RequestsContext.Provider value={value}>
      {children}
    </RequestsContext.Provider>
  );
};

export const useRequests = () => {
  const context = useContext(RequestsContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestsProvider');
  }
  return context;
};
