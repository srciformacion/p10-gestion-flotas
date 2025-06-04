
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TransportRequest } from '@/types/request';
import { requestsApi } from '@/services/api/requests';
import { mockServices } from '@/services/api/mock-services';

interface RequestsContextType {
  requests: TransportRequest[];
  filteredRequests: TransportRequest[];
  addRequest: (request: Omit<TransportRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'type' | 'priority'>) => Promise<void>;
  updateRequestStatus: (id: string, status: TransportRequest['status'], data?: Partial<TransportRequest>) => Promise<void>;
  getRequestById: (id: string) => TransportRequest | undefined;
  isLoading: boolean;
  useMockData: boolean;
  setUseMockData: (use: boolean) => void;
  refreshRequests: () => Promise<void>;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: React.ReactNode }) => {
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      if (useMockData) {
        // Use mock data - convert to the expected format
        const mockData = mockServices.map(service => ({
          ...service,
          type: 'simple' as const,
          priority: 'medium' as const,
          createdAt: service.createdAt || new Date().toISOString(),
          updatedAt: service.updatedAt || new Date().toISOString(),
          observations: service.observations || ''
        }));
        setRequests(mockData);
      } else {
        // Use API data
        const data = await requestsApi.getAll();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }, [useMockData]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const addRequest = useCallback(async (requestData: Omit<TransportRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'type' | 'priority'>) => {
    try {
      if (useMockData) {
        // Add to mock data
        const newRequest: TransportRequest = {
          ...requestData,
          id: `srv-${Date.now()}`,
          status: 'pending',
          type: 'simple',
          priority: 'medium',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          observations: requestData.observations || ''
        };
        setRequests(prev => [newRequest, ...prev]);
      } else {
        // Use API
        const newRequest = await requestsApi.create(requestData);
        setRequests(prev => [newRequest, ...prev]);
      }
    } catch (error) {
      console.error('Error adding request:', error);
      throw error;
    }
  }, [useMockData]);

  const updateRequestStatus = useCallback(async (
    id: string, 
    status: TransportRequest['status'], 
    data?: Partial<TransportRequest>
  ) => {
    try {
      if (useMockData) {
        // Update mock data
        setRequests(prev => prev.map(req => 
          req.id === id 
            ? { ...req, status, ...data, updatedAt: new Date().toISOString() }
            : req
        ));
      } else {
        // Use API
        const updatedRequest = await requestsApi.update(id, { status, ...data });
        setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      throw error;
    }
  }, [useMockData]);

  const getRequestById = useCallback((id: string) => {
    return requests.find(req => req.id === id);
  }, [requests]);

  const refreshRequests = useCallback(async () => {
    await loadRequests();
  }, [loadRequests]);

  // Memoize filteredRequests - currently just returning all requests
  const filteredRequests = useMemo(() => requests, [requests]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    requests, 
    filteredRequests,
    addRequest, 
    updateRequestStatus, 
    getRequestById,
    isLoading,
    useMockData,
    setUseMockData,
    refreshRequests
  }), [
    requests, 
    filteredRequests, 
    addRequest, 
    updateRequestStatus, 
    getRequestById, 
    isLoading, 
    useMockData, 
    refreshRequests
  ]);

  return (
    <RequestsContext.Provider value={contextValue}>
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
