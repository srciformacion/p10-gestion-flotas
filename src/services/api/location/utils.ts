
import { LatLng } from '@/types/location';

// Calcular la distancia entre dos puntos usando la fórmula haversine
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radio de la tierra en km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distancia en km
  return distance;
}

// Convertir grados a radianes
function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Calcular un punto aleatorio cercano a otro punto (para simulación)
export function getRandomNearbyPoint(center: LatLng, radiusKm: number = 0.5): LatLng {
  const radiusInDegrees = radiusKm / 111; // Aproximadamente 111km por grado
  
  const x0 = center.lng;
  const y0 = center.lat;
  
  // Punto aleatorio en un círculo
  const u = Math.random();
  const v = Math.random();
  
  const w = radiusInDegrees * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  
  // Ajustar el punto aleatorio al origen
  return {
    lng: x0 + x,
    lat: y0 + y
  };
}

// Calcular tiempo estimado de llegada
export function calculateETA(
  distance: number, 
  speed: number = 50 // km/h por defecto
): Date {
  const timeHours = distance / speed;
  const timeMs = timeHours * 60 * 60 * 1000;
  return new Date(Date.now() + timeMs);
}

// Generar un identificador único
export function generateUUID(): string {
  return crypto.randomUUID();
}

// Cálculo de rumbo entre dos puntos
export function calculateHeading(
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number
): number {
  const startLat_rad = deg2rad(startLat);
  const startLng_rad = deg2rad(startLng);
  const destLat_rad = deg2rad(destLat);
  const destLng_rad = deg2rad(destLng);
  
  const y = Math.sin(destLng_rad - startLng_rad) * Math.cos(destLat_rad);
  const x = Math.cos(startLat_rad) * Math.sin(destLat_rad) -
            Math.sin(startLat_rad) * Math.cos(destLat_rad) * Math.cos(destLng_rad - startLng_rad);
  
  let brng = Math.atan2(y, x);
  brng = brng * 180 / Math.PI;
  brng = (brng + 360) % 360;
  
  return brng;
}
