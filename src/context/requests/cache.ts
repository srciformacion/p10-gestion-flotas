
// Simple in-memory cache system for requests data

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Simple in-memory cache
const cache: {
  [key: string]: CacheItem<any>;
} = {};

// Cache management functions
export const getFromCache = <T>(key: string): T | null => {
  const item = cache[key];
  if (!item) return null;
  
  const now = Date.now();
  if (now - item.timestamp > CACHE_EXPIRY) {
    delete cache[key];
    return null;
  }
  
  return item.data;
};

export const setInCache = <T>(key: string, data: T): void => {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
};

export const clearCacheByPattern = (pattern: string): void => {
  Object.keys(cache).forEach(key => {
    if (key.includes(pattern)) {
      delete cache[key];
    }
  });
};
