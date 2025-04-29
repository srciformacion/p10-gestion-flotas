
import { useEffect, useCallback, useMemo } from 'react';
import { RequestStatus, TransportRequest } from '@/types';
import { assignmentsApi } from '@/services/api/assignments';
import { useNotifications } from '@/context/NotificationsContext';
import { RequestsContext } from './RequestsContext';
import { useRequestsState } from './hooks/useRequestsState';
import { 
  fetchRequests as fetchRequestsOp,
  addRequest as addRequestOp,
  updateRequestStatus as updateRequestStatusOp,
  getRequestById as getRequestByIdOp,
  assignVehicleAutomatically as assignVehicleAutomaticallyOp,
  checkForAssignmentConflicts,
  getAssignmentForRequest as getAssignmentForRequestOp
} from './operations/requestOperations';
import { 
  createStatusNotification, 
  createRequestNotification,
  createAssignmentNotification,
  createAssignmentErrorNotification 
} from './notifications/notificationHandlers';

interface RequestsProviderProps {
  children: React.ReactNode;
}

export const RequestsProvider = ({ children }: RequestsProviderProps) => {
  const { 
    requests, setRequests, 
    assignments, setAssignments,
    isLoading, setIsLoading,
    currentPage, setCurrentPage,
    pageSize, totalRequests, setTotalRequests,
    requestCache, setRequestCache
  } = useRequestsState();
  
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
    await fetchRequestsOp(setIsLoading, setRequests, setTotalRequests, setRequestCache, filters);
  }, []);

  const clearCache = useCallback(() => {
    setRequestCache({});
  }, []);

  const addRequest = async (requestData: Omit<TransportRequest, 'id' | 'status'>) => {
    const newRequest = await addRequestOp(requestData, setRequests, setRequestCache, setTotalRequests);
    
    addNotification(createRequestNotification(requestData.patientName));
  };

  const updateRequestStatus = async (
    id: string, 
    status: RequestStatus, 
    data?: Partial<TransportRequest>
  ): Promise<void> => {
    try {
      const request = getRequestById(id);
      const oldStatus = request?.status;
      
      const updatedRequest = await updateRequestStatusOp(id, status, data, requests, setRequests, setRequestCache);
      
      const notification = createStatusNotification(status, updatedRequest, oldStatus);
      if (notification) {
        addNotification(notification);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  };

  const getRequestById = useCallback((id: string) => {
    return getRequestByIdOp(id, requests, requestCache);
  }, [requests, requestCache]);

  const assignVehicleAutomatically = async (requestId: string) => {
    try {
      const assignment = await assignVehicleAutomaticallyOp(
        requestId, 
        setAssignments,
        setRequests, 
        setRequestCache
      );
      
      if (assignment) {
        addNotification(createAssignmentNotification(requestId));
        return assignment;
      }
      
      return null;
    } catch (error) {
      console.error('Error in automatic assignment:', error);
      
      addNotification(createAssignmentErrorNotification(requestId));
      return null;
    }
  };

  const getAssignmentForRequest = async (requestId: string) => {
    return getAssignmentForRequestOp(requestId, assignments, setAssignments);
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
