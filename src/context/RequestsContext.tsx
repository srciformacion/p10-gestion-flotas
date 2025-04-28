
import { createContext, useContext, useState, useEffect } from 'react';
import { TransportRequest, Assignment } from '@/types';
import { requestsApi } from '@/services/api/requests';
import { assignmentsApi, intelligentAssignmentService } from '@/services/api/assignments';

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

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load both requests and assignments
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
  };

  const updateRequestStatus = async (
    id: string, 
    status: TransportRequest['status'], 
    data?: Partial<TransportRequest>
  ) => {
    const updatedRequest = await requestsApi.update(id, { status, ...data });
    setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
  };

  const getRequestById = (id: string) => {
    return requests.find(req => req.id === id);
  };

  // Function to automatically assign a vehicle to a request
  const assignVehicleAutomatically = async (requestId: string): Promise<Assignment | null> => {
    try {
      const assignment = await intelligentAssignmentService.assignAmbulance(requestId);
      
      if (assignment) {
        // Update the assignments state
        setAssignments(prev => [...prev, assignment]);
        
        // Update the request in the state
        const request = await requestsApi.getById(requestId);
        if (request) {
          setRequests(prev => prev.map(req => 
            req.id === requestId ? request : req
          ));
        }
        
        return assignment;
      }
      
      return null;
    } catch (error) {
      console.error('Error in automatic assignment:', error);
      return null;
    }
  };

  // Function to check for scheduling conflicts
  const checkForAssignmentConflicts = async (requestId: string, ambulanceId: string, dateTime: string): Promise<boolean> => {
    return intelligentAssignmentService.checkForConflicts(requestId, ambulanceId, dateTime);
  };

  // Function to get an assignment for a request
  const getAssignmentForRequest = async (requestId: string): Promise<Assignment | null> => {
    return assignmentsApi.getByRequestId(requestId);
  };

  // Filtered requests - currently just returning all requests
  // This can be modified later to actually filter based on criteria if needed
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
