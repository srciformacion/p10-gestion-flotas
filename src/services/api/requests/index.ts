
import { requestsApi } from './requestsApi';
import { getFromCache, setInCache, clearCacheByPattern, clearAllCache } from './cache';
import { storageOperations } from './storage';

// Export the main API with additional cache management functions
export const requests = {
  ...requestsApi,
  
  // Add cache management methods
  clearCache: (): void => {
    clearAllCache();
  },
  
  clearRequestCache: (id?: string): void => {
    if (id) {
      clearCacheByPattern(`request-${id}`);
    } else {
      clearCacheByPattern('request-');
      clearCacheByPattern('allRequests');
    }
  }
};

// Export individual modules for direct access
export { getFromCache, setInCache, clearCacheByPattern, clearAllCache };
export { storageOperations };
export { requestsApi };
