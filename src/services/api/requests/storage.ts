
import { TransportRequest } from '@/types';

// Helper functions for localStorage operations
export const storageOperations = {
  // Get all requests from storage
  getRequests: (): TransportRequest[] => {
    const stored = localStorage.getItem('requests');
    return stored ? JSON.parse(stored) : [];
  },
  
  // Save requests to storage
  saveRequests: (requests: TransportRequest[]): void => {
    localStorage.setItem('requests', JSON.stringify(requests));
  },
  
  // Get a single request by ID
  getRequestById: (id: string): TransportRequest | null => {
    const requests = storageOperations.getRequests();
    return requests.find(req => req.id === id) || null;
  },
  
  // Add a new request to storage
  addRequest: (request: TransportRequest): void => {
    const requests = storageOperations.getRequests();
    requests.push(request);
    storageOperations.saveRequests(requests);
  },
  
  // Update an existing request
  updateRequest: (id: string, data: Partial<TransportRequest>): TransportRequest | null => {
    const requests = storageOperations.getRequests();
    const index = requests.findIndex(req => req.id === id);
    
    if (index === -1) return null;
    
    const updatedRequest = { ...requests[index], ...data };
    requests[index] = updatedRequest;
    storageOperations.saveRequests(requests);
    
    return updatedRequest;
  },
  
  // Delete a request by ID
  deleteRequest: (id: string): boolean => {
    const requests = storageOperations.getRequests();
    const filtered = requests.filter(req => req.id !== id);
    
    if (filtered.length === requests.length) return false;
    
    storageOperations.saveRequests(filtered);
    return true;
  }
};
