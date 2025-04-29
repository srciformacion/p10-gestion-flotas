
/**
 * Utility functions for location-related operations
 */

// Simulate geocoding (in production would use a real geocoding API)
export function simulateGeocode(address: string): { latitude: number; longitude: number } {
  // Base: coordenadas de La Rioja, España
  const baseLat = 42.4627;
  const baseLng = -2.4450;
  
  // Generate variation based on a simple hash of the address
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = ((hash << 5) - hash) + address.charCodeAt(i);
    hash |= 0;
  }
  
  // Variation of ±0.1 degrees approx
  const latVariation = (hash % 100) / 1000;
  const lngVariation = ((hash / 100) % 100) / 1000;
  
  return {
    latitude: baseLat + latVariation,
    longitude: baseLng + lngVariation
  };
}

// Calculate distance between two geographical points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
}

// Convert degrees to radians
export function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}
