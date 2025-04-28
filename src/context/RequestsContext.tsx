import { createContext, useContext, useState, useEffect } from 'react';
import { TransportRequest, Assignment } from '@/types';
import { requestsApi } from '@/services/api/requests';
import { assignmentsApi } from '@/services/api/assignments';
import { intelligentAssignmentService } from '@/services/api/intelligentAssignment';
import { useNotifications } from '@/context/NotificationsContext';

interface RequestsContextType {
  requests: TransportRequest[];
  filteredRequests: TransportRequest[];
  assignments: Assignment[];
  addRequest: (request: Omit<TransportRequest, 'id' | 'status'>) => Promise<void>;
  updateRequestStatus: (id: string, status: TransportRequest['status'], data?: Partial<TransportRequest>) => Promise<void>;
  getRequestById: (id: string) => TransportRequest | undefined;
  assignVehicleAutomatically: (requestId: string) => Promise<Assignment | null>;
  checkForAssignmentConflicts: (requestId: string, ambulanceId: string, dateTime: string) => Promise<boolean>;
  getAssignmentForRequest: (requestId: string) => Promise<Assignment | null>;
  isLoading: boolean;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: React.ReactNode }) => {
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [requestsData, assignmentsData] = await Promise.all([
          requestsApi.getAll(),
          assignmentsApi.getAll()
        ]);
        
        setRequests(requestsData);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addRequest = async (requestData: Omit<TransportRequest, 'id' | 'status'>) => {
    const newRequest = await requestsApi.create(requestData);
    setRequests(prev => [...prev, newRequest]);
    
    addNotification({
      title: 'Nueva solicitud',
      message: `Se ha creado una nueva solicitud para ${requestData.patientName}`,
      type: 'info'
    });
  };

  const updateRequestStatus = async (
    id: string, 
    status: TransportRequest['status'], 
    data?: Partial<TransportRequest>
  ) => {
    const request = getRequestById(id);
    const oldStatus = request?.status;
    
    const updatedRequest = await requestsApi.update(id, { status, ...data });
    setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
    
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
  };

  const getRequestById = (id: string) => {
    return requests.find(req => req.id === id);
  };

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
    return assignmentsApi.getByRequestId(requestId);
  };

  const filteredRequests = requests;

  return (
    <RequestsContext.Provider 
      value={{ 
        requests, 
        filteredRequests,
        assignments,
        addRequest, 
        updateRequestStatus, 
        getRequestById,
        assignVehicleAutomatically,
        checkForAssignmentConflicts,
        getAssignmentForRequest,
        isLoading 
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
