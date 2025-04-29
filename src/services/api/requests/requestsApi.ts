
import { TransportRequest } from '@/types';
import { getFromCache, setInCache } from './cache';

// Core API implementation for request operations
export const requestsApi = {
  getAll: async (): Promise<TransportRequest[]> => {
    try {
      // Check cache first
      const cachedData = getFromCache<TransportRequest[]>('allRequests');
      if (cachedData) return [...cachedData]; // Return a copy to prevent mutations
      
      // Simulate network delay (reduced for better performance)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get data from localStorage
      const stored = localStorage.getItem('requests');
      const requests = stored ? JSON.parse(stored) : [];
      
      // Cache the result
      setInCache('allRequests', requests);
      
      return requests;
    } catch (error) {
      console.error('Error fetching all requests:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<TransportRequest | null> => {
    try {
      // Check cache first
      const cachedData = getFromCache<TransportRequest>(`request-${id}`);
      if (cachedData) return { ...cachedData }; // Return a copy
      
      // Simulate reduced network delay for better performance
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const stored = localStorage.getItem('requests');
      const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
      const request = requests.find(req => req.id === id) || null;
      
      // Cache individual request
      if (request) {
        setInCache(`request-${id}`, request);
      }
      
      return request;
    } catch (error) {
      console.error(`Error fetching request ${id}:`, error);
      return null;
    }
  },

  create: async (request: Omit<TransportRequest, 'id' | 'status'>): Promise<TransportRequest> => {
    try {
      // Reduced simulation delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newRequest: TransportRequest = {
        ...request,
        id: crypto.randomUUID(),
        status: 'pending',
      };
      
      const stored = localStorage.getItem('requests');
      const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
      requests.push(newRequest);
      localStorage.setItem('requests', JSON.stringify(requests));
      
      // Invalidate the cache for all requests
      setInCache(`request-${newRequest.id}`, newRequest);
      
      return newRequest;
    } catch (error) {
      console.error('Error creating request:', error);
      throw new Error('Failed to create request');
    }
  },

  update: async (id: string, data: Partial<TransportRequest>): Promise<TransportRequest> => {
    try {
      // Reduced simulation delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
      
      // Update cache
      setInCache(`request-${id}`, updatedRequest); // Update individual request cache
      
      return updatedRequest;
    } catch (error) {
      console.error(`Error updating request ${id}:`, error);
      throw new Error('Failed to update request');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      // Reduced simulation delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const stored = localStorage.getItem('requests');
      const requests: TransportRequest[] = stored ? JSON.parse(stored) : [];
      const filtered = requests.filter(req => req.id !== id);
      localStorage.setItem('requests', JSON.stringify(filtered));
    } catch (error) {
      console.error(`Error deleting request ${id}:`, error);
      throw new Error('Failed to delete request');
    }
  }
};
