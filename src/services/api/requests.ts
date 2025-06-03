
import { TransportRequest } from '@/types/request';

// Cache para mejorar rendimiento
let requestsCache: TransportRequest[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const isValidCache = () => {
  return requestsCache && (Date.now() - cacheTimestamp) < CACHE_DURATION;
};

// Simulación de llamadas API que luego conectaremos al backend real
export const requestsApi = {
  getAll: async (): Promise<TransportRequest[]> => {
    // Verificar cache primero
    if (isValidCache()) {
      console.log('Usando datos del cache');
      return requestsCache!;
    }

    // Simular delay de red más corto
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Por ahora retornamos los datos del localStorage
    const stored = localStorage.getItem('requests');
    const requests = stored ? JSON.parse(stored) : [];
    
    // Actualizar cache
    requestsCache = requests;
    cacheTimestamp = Date.now();
    
    return requests;
  },

  getById: async (id: string): Promise<TransportRequest | null> => {
    // Intentar obtener del cache primero
    if (isValidCache()) {
      const found = requestsCache!.find(req => req.id === id);
      if (found) return found;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
    const stored = localStorage.getItem('requests');
    const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
    return requests.find(req => req.id === id) || null;
  },

  create: async (request: Omit<TransportRequest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'type' | 'priority'>): Promise<TransportRequest> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newRequest: TransportRequest = {
      ...request,
      id: crypto.randomUUID(),
      status: 'pending',
      type: 'simple',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      observations: request.observations || ''
    };
    
    const stored = localStorage.getItem('requests');
    const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
    requests.push(newRequest);
    localStorage.setItem('requests', JSON.stringify(requests));
    
    // Invalidar cache
    requestsCache = null;
    
    return newRequest;
  },

  update: async (id: string, data: Partial<TransportRequest>): Promise<TransportRequest> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const stored = localStorage.getItem('requests');
    const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
    const index = requests.findIndex(req => req.id === id);
    
    if (index === -1) {
      throw new Error('Request not found');
    }
    
    const updatedRequest = {
      ...requests[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    requests[index] = updatedRequest;
    localStorage.setItem('requests', JSON.stringify(requests));
    
    // Invalidar cache
    requestsCache = null;
    
    return updatedRequest;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const stored = localStorage.getItem('requests');
    const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
    const filtered = requests.filter(req => req.id !== id);
    localStorage.setItem('requests', JSON.stringify(filtered));
    
    // Invalidar cache
    requestsCache = null;
  }
};
