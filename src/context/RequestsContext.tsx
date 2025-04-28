
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TransportRequest, Assignment, RequestStatus } from '@/types';
import { requestsApi } from '@/services/api/requests';
import { assignmentsApi } from '@/services/api/assignments';
import { intelligentAssignmentService } from '@/services/api/intelligentAssignment';
import { useNotifications } from '@/context/NotificationsContext';

interface RequestsContextType {
  requests: TransportRequest[];
  filteredRequests: TransportRequest[];
  assignments: Assignment[];
  addRequest: (request: Omit<TransportRequest, 'id' | 'status'>) => Promise<void>;
  updateRequestStatus: (id: string, status: RequestStatus, data?: Partial<TransportRequest>) => Promise<void>;
  getRequestById: (id: string) => TransportRequest | undefined;
  assignVehicleAutomatically: (requestId: string) => Promise<Assignment | null>;
  checkForAssignmentConflicts: (requestId: string, ambulanceId: string, dateTime: string) => Promise<boolean>;
  getAssignmentForRequest: (requestId: string) => Promise<Assignment | null>;
  isLoading: boolean;
  fetchRequests: (filters?: { status?: RequestStatus | 'all', search?: string }) => Promise<void>;
  pageSize: number;
  currentPage: number;
  totalRequests: number;
  setCurrentPage: (page: number) => void;
  clearCache: () => void;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: React.ReactNode }) => {
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRequests, setTotalRequests] = useState(0);
  const [requestCache, setRequestCache] = useState<Record<string, TransportRequest>>({});
  const { addNotification } = useNotifications();

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        const assignmentsData = await assignmentsApi.getAll();
        setAssignments(assignmentsData);
        await fetchRequests();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Optimized fetching with caching and filtering
  const fetchRequests = useCallback(async (filters?: { status?: RequestStatus | 'all', search?: string }) => {
    setIsLoading(true);
    try {
      const requestsData = await requestsApi.getAll();
      
      // Update total count
      setTotalRequests(requestsData.length);
      
      // Apply filters if provided
      let filteredData = requestsData;
      if (filters) {
        if (filters.status && filters.status !== 'all') {
          filteredData = filteredData.filter(req => req.status === filters.status);
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(req => 
            req.patientName.toLowerCase().includes(searchLower) ||
            (req.patientId && req.patientId.toLowerCase().includes(searchLower)) ||
            req.origin.toLowerCase().includes(searchLower) ||
            req.destination.toLowerCase().includes(searchLower)
          );
        }
      }
      
      // Sort by date (newest first)
      filteredData.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
      
      // Update cache
      const newCache: Record<string, TransportRequest> = {};
      filteredData.forEach(req => {
        newCache[req.id] = req;
      });
      
      setRequestCache(prevCache => ({ ...prevCache, ...newCache }));
      setRequests(filteredData);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    setRequestCache({});
  }, []);

  const addRequest = async (requestData: Omit<TransportRequest, 'id' | 'status'>) => {
    const newRequest = await requestsApi.create(requestData);
    setRequests(prev => [newRequest, ...prev]);
    setRequestCache(prev => ({ ...prev, [newRequest.id]: newRequest }));
    setTotalRequests(prev => prev + 1);
    
    addNotification({
      title: 'Nueva solicitud',
      message: `Se ha creado una nueva solicitud para ${requestData.patientName}`,
      type: 'info'
    });
  };

  const updateRequestStatus = async (
    id: string, 
    status: RequestStatus, 
    data?: Partial<TransportRequest>
  ): Promise<void> => {
    try {
      const request = getRequestById(id);
      const oldStatus = request?.status;
      
      const updatedRequest = await requestsApi.update(id, { status, ...data });
      
      // Update in state and cache
      setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      setRequestCache(prev => ({ ...prev, [id]: updatedRequest }));
      
      const statusMessages = {
        pending: 'Solicitud en espera',
        assigned: 'Vehículo asignado',
        inRoute: 'Vehículo en camino',
        completed: 'Servicio completado',
        cancelled: 'Servicio cancelado'
      };
      
      const notificationTypes = {
        pending: 'info',
        assigned: 'info',
        inRoute: 'info',
        completed: 'success',
        cancelled: 'warning'
      };
      
      if (oldStatus !== status) {
        addNotification({
          title: statusMessages[status],
          message: `Solicitud ${updatedRequest.id} para ${updatedRequest.patientName}: ${statusMessages[status]}`,
          type: notificationTypes[status] as 'info' | 'success' | 'warning' | 'error'
        });
      }
      
      // Return void instead of the updatedRequest
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  };

  const getRequestById = useCallback((id: string) => {
    // Check cache first
    if (requestCache[id]) {
      return requestCache[id];
    }
    
    // Fallback to requests array
    return requests.find(req => req.id === id);
  }, [requests, requestCache]);

  const assignVehicleAutomatically = async (requestId: string): Promise<Assignment | null> => {
    try {
      const assignment = await intelligentAssignmentService.assignAmbulance(requestId);
      
      if (assignment) {
        setAssignments(prev => [...prev, assignment]);
        
        const request = await requestsApi.getById(requestId);
        if (request) {
          setRequests(prev => prev.map(req => 
            req.id === requestId ? request : req
          ));
          setRequestCache(prev => ({ ...prev, [requestId]: request }));
          
          addNotification({
            title: 'Asignación automática',
            message: `Se ha asignado automáticamente un vehículo a la solicitud ${requestId}`,
            type: 'success'
          });
        }
        
        return assignment;
      }
      
      return null;
    } catch (error) {
      console.error('Error in automatic assignment:', error);
      
      addNotification({
        title: 'Error en asignación',
        message: `No se pudo asignar un vehículo automáticamente a la solicitud ${requestId}`,
        type: 'error'
      });
      return null;
    }
  };

  const checkForAssignmentConflicts = async (requestId: string, ambulanceId: string, dateTime: string): Promise<boolean> => {
    return intelligentAssignmentService.checkForConflicts(requestId, ambulanceId, dateTime);
  };

  const getAssignmentForRequest = async (requestId: string): Promise<Assignment | null> => {
    const cached = assignments.find(a => a.requestId === requestId);
    if (cached) return cached;
    
    const assignment = await assignmentsApi.getByRequestId(requestId);
    if (assignment) {
      setAssignments(prev => [...prev, assignment]);
    }
    return assignment;
  };

  // Memoize filtered requests to prevent unnecessary re-renders
  const filteredRequests = useMemo(() => {
    return requests;
  }, [requests]);

  // Calculate pagination
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return requests.slice(start, end);
  }, [requests, currentPage, pageSize]);

  return (
    <RequestsContext.Provider 
      value={{ 
        requests: paginatedRequests,
        filteredRequests,
        assignments,
        addRequest, 
        updateRequestStatus, 
        getRequestById,
        assignVehicleAutomatically,
        checkForAssignmentConflicts,
        getAssignmentForRequest,
        isLoading,
        fetchRequests,
        pageSize,
        currentPage,
        totalRequests,
        setCurrentPage,
        clearCache
      }}
    >
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
