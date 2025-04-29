
import { GpsLocation, VehicleLocation } from '@/types/location';
import { mockVehicleLocations } from './types';
import { calculateDistance } from './utils';

export const vehicleService = {
  getVehicleLocations: async (): Promise<VehicleLocation[]> => {
    // En producción, aquí se haría una llamada a la API real
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular latencia
    return mockVehicleLocations;
  },

  getVehicleLocation: async (vehicleId: string): Promise<VehicleLocation | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockVehicleLocations.find(vehicle => vehicle.id === vehicleId) || null;
  },

  updateVehicleLocation: async (vehicleId: string, location: GpsLocation): Promise<VehicleLocation> => {
    const index = mockVehicleLocations.findIndex(vehicle => vehicle.id === vehicleId);
    if (index === -1) {
      throw new Error('Vehículo no encontrado');
    }

    mockVehicleLocations[index].location = location;
    return mockVehicleLocations[index];
  },

  getNearestVehicle: async (
    latitude: number, 
    longitude: number, 
    status: 'available' | 'all' = 'available'
  ): Promise<{vehicle: VehicleLocation, distance: number} | null> => {
    const locations = await vehicleService.getVehicleLocations();
    
    let availableVehicles = status === 'all' 
      ? locations 
      : locations.filter(v => v.status === 'available');
    
    if (availableVehicles.length === 0) {
      return null;
    }
    
    // Calcular la distancia para cada vehículo usando la fórmula Haversine
    const vehiclesWithDistance = availableVehicles.map(vehicle => {
      const distance = calculateDistance(
        latitude, 
        longitude, 
        vehicle.location.latitude, 
        vehicle.location.longitude
      );
      return { vehicle, distance };
    });
    
    // Ordenar por distancia y devolver el más cercano
    vehiclesWithDistance.sort((a, b) => a.distance - b.distance);
    return vehiclesWithDistance[0];
  },

  updateEstimatedArrival: async (vehicleId: string, requestId: string, estimatedArrival: string): Promise<void> => {
    const index = mockVehicleLocations.findIndex(vehicle => vehicle.id === vehicleId);
    if (index === -1) {
      throw new Error('Vehículo no encontrado');
    }

    mockVehicleLocations[index].estimatedArrival = estimatedArrival;
    mockVehicleLocations[index].assignedToRequestId = requestId;
    mockVehicleLocations[index].inService = true;
  }
};
