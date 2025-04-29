
import { TransportRequest, RequestStatus, Assignment } from '@/types';
import { requestsApi } from '@/services/api/requests/requestsApi';
import { assignmentsApi } from '@/services/api/assignments';
import { intelligentAssignmentService } from '@/services/api/intelligentAssignment';

export const fetchRequests = async (
  setIsLoading: (value: boolean) => void,
  setRequests: (requests: TransportRequest[]) => void,
  setTotalRequests: (count: number) => void,
  setRequestCache: (cache: Record<string, TransportRequest> | ((prev: Record<string, TransportRequest>) => Record<string, TransportRequest>)) => void,
  filters?: { status?: RequestStatus | 'all', search?: string }
) => {
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
    
    setRequestCache((prevCache) => ({ ...prevCache, ...newCache }));
    setRequests(filteredData);
  } catch (error) {
    console.error('Error fetching requests:', error);
  } finally {
    setIsLoading(false);
  }
};

export const addRequest = async (
  requestData: Omit<TransportRequest, 'id' | 'status'>,
  setRequests: (updater: (prev: TransportRequest[]) => TransportRequest[]) => void,
  setRequestCache: (updater: (prev: Record<string, TransportRequest>) => Record<string, TransportRequest>) => void,
  setTotalRequests: (updater: (prev: number) => number) => void
) => {
  const newRequest = await requestsApi.create(requestData);
  setRequests(prev => [newRequest, ...prev]);
  setRequestCache((prev) => ({ ...prev, [newRequest.id]: newRequest }));
  setTotalRequests(prev => prev + 1);
  
  return newRequest;
};

export const updateRequestStatus = async (
  id: string, 
  status: RequestStatus,
  data: Partial<TransportRequest> | undefined,
  requests: TransportRequest[],
  setRequests: (requests: TransportRequest[]) => void,
  setRequestCache: (cache: Record<string, TransportRequest> | ((prev: Record<string, TransportRequest>) => Record<string, TransportRequest>)) => void
): Promise<TransportRequest> => {
  const updatedRequest = await requestsApi.update(id, { status, ...data });
  
  // Update in state and cache
  setRequests(requests.map(req => req.id === id ? updatedRequest : req));
  setRequestCache((prev) => ({ ...prev, [id]: updatedRequest }));
  
  return updatedRequest;
};

export const getRequestById = (
  id: string,
  requests: TransportRequest[],
  requestCache: Record<string, TransportRequest>
): TransportRequest | undefined => {
  // Check cache first
  if (requestCache[id]) {
    return requestCache[id];
  }
  
  // Fallback to requests array
  return requests.find(req => req.id === id);
};

export const assignVehicleAutomatically = async (
  requestId: string,
  setAssignments: (updater: (prev: Assignment[]) => Assignment[]) => void,
  setRequests: (updater: (prev: TransportRequest[]) => TransportRequest[]) => void,
  setRequestCache: (updater: (prev: Record<string, TransportRequest>) => Record<string, TransportRequest>) => void
): Promise<Assignment | null> => {
  const assignment = await intelligentAssignmentService.assignAmbulance(requestId);
  
  if (assignment) {
    setAssignments((prev) => [...prev, assignment]);
    
    const request = await requestsApi.getById(requestId);
    if (request) {
      setRequests(prev => prev.map(req => 
        req.id === requestId ? request : req
      ));
      setRequestCache((prev) => ({ ...prev, [requestId]: request }));
    }
    
    return assignment;
  }
  
  return null;
};

export const checkForAssignmentConflicts = async (requestId: string, ambulanceId: string, dateTime: string): Promise<boolean> => {
  return intelligentAssignmentService.checkForConflicts(requestId, ambulanceId, dateTime);
};

export const getAssignmentForRequest = async (
  requestId: string,
  assignments: Assignment[],
  setAssignments: (assignments: Assignment[]) => void
): Promise<Assignment | null> => {
  const cached = assignments.find(a => a.requestId === requestId);
  if (cached) return cached;
  
  const assignment = await assignmentsApi.getByRequestId(requestId);
  if (assignment) {
    setAssignments([...assignments, assignment]);
  }
  return assignment;
};
