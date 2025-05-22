
import { TransportRequest } from '@/types';

// Simulación de llamadas API que luego conectaremos al backend real
export const requestsApi = {
  getAll: async (): Promise<TransportRequest[]> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    // Por ahora retornamos los datos del localStorage
    const stored = localStorage.getItem('requests');
    return stored ? JSON.parse(stored) : [];
  },

  getById: async (id: string): Promise<TransportRequest | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem('requests');
    const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
    return requests.find(req => req.id === id) || null;
  },

  create: async (request: Omit<TransportRequest, 'id' | 'status'>): Promise<TransportRequest> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const newRequest: TransportRequest = {
      ...request,
      id: crypto.randomUUID(),
      status: 'pending',
    };
    
    const stored = localStorage.getItem('requests');
    const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
    requests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(requests));
    
    return newRequest;
  },

  update: async (id: string, data: Partial<TransportRequest>): Promise<TransportRequest> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('requests');
    const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
    const index = requests.findIndex(req => req.id === id);
    
    if (index === -1) {
      throw new Error('Request not found');
    }
    
    const updatedRequest = {
      ...requests[index],
      ...data,
    };
    
    requests[index] = updatedRequest;
    localStorage.setItem('requests', JSON.stringify(requests));
    
    return updatedRequest;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const stored = localStorage.getItem('requests');
    const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
    const filtered = requests.filter(req => req.id !== id);
    localStorage.setItem('requests', JSON.stringify(filtered));
  }
};

