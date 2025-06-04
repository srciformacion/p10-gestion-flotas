
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: React.ReactNode }) => {
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadRequests = async () => {
      if (!mounted) return;
      
      setIsLoading(true);
      try {
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
          if (mounted) setRequests(mockData);
        } else {
          // Use API data
          const data = await requestsApi.getAll();
          if (mounted) setRequests(data);
        }
      } catch (error) {
        console.error('Error loading requests:', error);
        if (mounted) setRequests([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadRequests();
    
    return () => {
      mounted = false;
    };
  }, [useMockData]);

  const addRequest = async (requestData: Omit<TransportRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'type' | 'priority'>) => {
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
      setRequests(prev => [...prev, newRequest]);
    }
  };

  const updateRequestStatus = async (
    id: string, 
    status: TransportRequest['status'], 
    data?: Partial<TransportRequest>
  ) => {
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
  };

  const getRequestById = (id: string) => {
    return requests.find(req => req.id === id);
  };

  // Memoize filteredRequests to avoid unnecessary recalculations
  const filteredRequests = useMemo(() => requests, [requests]);

  const contextValue = useMemo(() => ({
    requests, 
    filteredRequests,
    addRequest, 
    updateRequestStatus, 
    getRequestById,
    isLoading,
    useMockData,
    setUseMockData
  }), [requests, filteredRequests, isLoading, useMockData]);

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
