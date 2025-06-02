
import { createContext, useContext, useState, useEffect } from 'react';
import { TransportRequest } from '@/types/request';
import { requestsApi } from '@/services/api/requests';
import { mockServices } from '@/services/api/mock-services';

interface RequestsContextType {
  requests: TransportRequest[];
  filteredRequests: TransportRequest[];
  addRequest: (request: Omit<TransportRequest, 'id' | 'status'>) => Promise<void>;
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
    const loadRequests = async () => {
      setIsLoading(true);
      try {
        if (useMockData) {
          // Use mock data
          setRequests(mockServices);
        } else {
          // Use API data
          const data = await requestsApi.getAll();
          setRequests(data);
        }
      } catch (error) {
        console.error('Error loading requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [useMockData]);

  const addRequest = async (requestData: Omit<TransportRequest, 'id' | 'status'>) => {
    if (useMockData) {
      // Add to mock data
      const newRequest: TransportRequest = {
        ...requestData,
        id: `srv-${Date.now()}`,
        status: 'pending',
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

  // Added filteredRequests - currently just returning all requests
  // This can be modified later to actually filter based on criteria if needed
  const filteredRequests = requests;

  return (
    <RequestsContext.Provider 
      value={{ 
        requests, 
        filteredRequests,
        addRequest, 
        updateRequestStatus, 
        getRequestById,
        isLoading,
        useMockData,
        setUseMockData
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
