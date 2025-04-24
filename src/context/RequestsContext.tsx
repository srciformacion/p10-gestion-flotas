
import { createContext, useContext, useState, useEffect } from 'react';
import { TransportRequest } from '@/types';
import { requestsApi } from '@/services/api/requests';

interface RequestsContextType {
  requests: TransportRequest[];
  addRequest: (request: Omit<TransportRequest, 'id' | 'status'>) => Promise<void>;
  updateRequestStatus: (id: string, status: TransportRequest['status'], data?: Partial<TransportRequest>) => Promise<void>;
  getRequestById: (id: string) => TransportRequest | undefined;
  isLoading: boolean;
}

const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export const RequestsProvider = ({ children }: { children: React.ReactNode }) => {
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await requestsApi.getAll();
        setRequests(data);
      } catch (error) {
        console.error('Error loading requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
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

  return (
    <RequestsContext.Provider 
      value={{ 
        requests, 
        addRequest, 
        updateRequestStatus, 
        getRequestById,
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

