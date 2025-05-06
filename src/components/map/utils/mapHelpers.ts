
import { LatLng } from '@/types/location';

/**
 * Generates simulated coordinates based on an address string
 * In production, this would be replaced with a real geocoding service
 */
export function generateSimulatedCoordinates(address: string): LatLng {
  // Base: coordenadas de Logroño
  const baseLat = 42.4627;
  const baseLng = -2.4450;
  
  // Generate variation based on a simple hash of the address
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = ((hash << 5) - hash) + address.charCodeAt(i);
    hash |= 0;
  }
  
  // Use the hash to generate a small but consistent variation
  const latVariation = (hash % 100) / 1000; // ±0.1 aprox
  const lngVariation = ((hash / 100) % 100) / 1000;
  
  return {
    lat: baseLat + latVariation,
    lng: baseLng + lngVariation
  };
}
