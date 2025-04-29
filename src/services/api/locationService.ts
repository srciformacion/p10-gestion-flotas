
import { GpsLocation, VehicleLocation, RouteHistory, LocationAlert } from '@/types/location';

// Simulación de datos de localización para desarrollo
let mockVehicleLocations: VehicleLocation[] = [
  {
    id: "AMB-001",
    licensePlate: "1234-AAA",
    location: {
      latitude: 42.4662,
      longitude: -2.4463,
      timestamp: new Date().toISOString(),
      vehicleId: "AMB-001",
      speed: 30,
      heading: 90
    },
    status: "available",
    inService: false
  },
  {
    id: "AMB-002",
    licensePlate: "5678-BBB",
    location: {
      latitude: 42.4712,
      longitude: -2.4413,
      timestamp: new Date().toISOString(),
      vehicleId: "AMB-002",
      speed: 0,
      heading: 180
    },
    status: "busy",
    inService: true,
    assignedToRequestId: "REQ-12345",
    estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  },
  {
    id: "AMB-003",
    licensePlate: "9012-CCC",
    location: {
      latitude: 42.4612,
      longitude: -2.4513,
      timestamp: new Date().toISOString(),
      vehicleId: "AMB-003",
      speed: 45,
      heading: 270
    },
    status: "busy",
    inService: true,
    assignedToRequestId: "REQ-67890",
    estimatedArrival: new Date(Date.now() + 8 * 60 * 1000).toISOString()
  },
  {
    id: "AMB-004",
    licensePlate: "3456-DDD",
    location: {
      latitude: 42.4552,
      longitude: -2.4383,
      timestamp: new Date().toISOString(),
      vehicleId: "AMB-004",
      speed: 0,
      heading: 0
    },
    status: "maintenance",
    inService: false
  }
];

let mockRouteHistory: RouteHistory[] = [];
let mockLocationAlerts: LocationAlert[] = [];

// Intervalo de simulación para actualizar posiciones
let simulationInterval: number | null = null;

const simulateMovement = () => {
  mockVehicleLocations = mockVehicleLocations.map(vehicle => {
    if (vehicle.status === "maintenance" || (vehicle.status === "available" && !vehicle.inService)) {
      return vehicle;
    }

    // Simular movimiento aleatorio para vehículos en servicio
    const latChange = (Math.random() - 0.5) * 0.001;
    const lngChange = (Math.random() - 0.5) * 0.001;
    const newSpeed = vehicle.status === "busy" ? Math.random() * 50 + 10 : 0;
    
    const newLocation: GpsLocation = {
      latitude: vehicle.location.latitude + latChange,
      longitude: vehicle.location.longitude + lngChange,
      timestamp: new Date().toISOString(),
      vehicleId: vehicle.id,
      speed: newSpeed,
      heading: Math.random() * 360
    };

    // Registrar punto en la ruta histórica si está en servicio
    if (vehicle.inService && vehicle.assignedToRequestId) {
      const routeExists = mockRouteHistory.some(
        route => route.vehicleId === vehicle.id && !route.completed
      );

      if (!routeExists) {
        mockRouteHistory.push({
          id: `ROUTE-${Date.now()}-${vehicle.id}`,
          assignmentId: `ASSIGN-${vehicle.assignedToRequestId}`,
          vehicleId: vehicle.id,
          startTime: new Date().toISOString(),
          points: [newLocation],
          completed: false
        });
      } else {
        const routeIndex = mockRouteHistory.findIndex(
          route => route.vehicleId === vehicle.id && !route.completed
        );
        if (routeIndex !== -1) {
          mockRouteHistory[routeIndex].points.push(newLocation);
        }
      }
    }

    return {
      ...vehicle,
      location: newLocation
    };
  });
};

// Simular generación de alertas
const checkForAlerts = () => {
  mockVehicleLocations.forEach(vehicle => {
    if (!vehicle.inService || !vehicle.assignedToRequestId) return;

    // Simular retraso (20% probabilidad)
    if (Math.random() < 0.01 && vehicle.estimatedArrival) {
      const estimatedArrival = new Date(vehicle.estimatedArrival);
      const now = new Date();
      
      // Si la estimación es en el pasado y aún no ha llegado
      if (estimatedArrival < now) {
        const delayMinutes = Math.floor((now.getTime() - estimatedArrival.getTime()) / (1000 * 60));
        
        if (delayMinutes > 5) {
          // Crear alerta de retraso si no existe una sin resolver
          const existingAlert = mockLocationAlerts.some(
            alert => alert.vehicleId === vehicle.id && 
                    alert.type === 'delay' && 
                    !alert.resolved &&
                    alert.requestId === vehicle.assignedToRequestId
          );

          if (!existingAlert) {
            mockLocationAlerts.push({
              id: `ALERT-${Date.now()}-${vehicle.id}`,
              vehicleId: vehicle.id,
              requestId: vehicle.assignedToRequestId,
              assignmentId: `ASSIGN-${vehicle.assignedToRequestId}`,
              type: 'delay',
              timestamp: new Date().toISOString(),
              location: vehicle.location,
              details: `Retraso de ${delayMinutes} minutos en la llegada estimada`,
              resolved: false
            });

            // Actualizar la estimación de llegada
            const vehicleIndex = mockVehicleLocations.findIndex(v => v.id === vehicle.id);
            if (vehicleIndex !== -1) {
              mockVehicleLocations[vehicleIndex].estimatedArrival = 
                new Date(now.getTime() + 10 * 60 * 1000).toISOString();
            }
          }
        }
      }
    }

    // Simular desvío (5% probabilidad)
    if (Math.random() < 0.005) {
      const existingDetourAlert = mockLocationAlerts.some(
        alert => alert.vehicleId === vehicle.id && 
                alert.type === 'detour' && 
                !alert.resolved &&
                alert.requestId === vehicle.assignedToRequestId
      );

      if (!existingDetourAlert) {
        mockLocationAlerts.push({
          id: `ALERT-${Date.now()}-${vehicle.id}`,
          vehicleId: vehicle.id,
          requestId: vehicle.assignedToRequestId,
          assignmentId: `ASSIGN-${vehicle.assignedToRequestId}`,
          type: 'detour',
          timestamp: new Date().toISOString(),
          location: vehicle.location,
          details: `La ambulancia se ha desviado significativamente de la ruta planificada`,
          resolved: false
        });
      }
    }
  });
};

export const locationService = {
  startTracking: () => {
    if (simulationInterval === null) {
      // Actualizar posiciones cada 5 segundos para la simulación
      simulationInterval = window.setInterval(() => {
        simulateMovement();
        checkForAlerts();
      }, 5000);
    }
  },

  stopTracking: () => {
    if (simulationInterval !== null) {
      clearInterval(simulationInterval);
      simulationInterval = null;
    }
  },

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

  getRouteHistory: async (assignmentId: string): Promise<RouteHistory | null> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockRouteHistory.find(route => route.assignmentId === assignmentId) || null;
  },

  completeRouteHistory: async (routeId: string): Promise<RouteHistory> => {
    const index = mockRouteHistory.findIndex(route => route.id === routeId);
    if (index === -1) {
      throw new Error('Ruta no encontrada');
    }

    mockRouteHistory[index].completed = true;
    mockRouteHistory[index].endTime = new Date().toISOString();
    
    // Calcular distancia y duración total
    mockRouteHistory[index].distance = Math.random() * 20 + 5; // Valor aleatorio entre 5 y 25 km
    
    const startTime = new Date(mockRouteHistory[index].startTime).getTime();
    const endTime = new Date(mockRouteHistory[index].endTime).getTime();
    mockRouteHistory[index].duration = Math.round((endTime - startTime) / (1000 * 60));
    
    return mockRouteHistory[index];
  },

  getAlerts: async (resolved: boolean = false): Promise<LocationAlert[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLocationAlerts.filter(alert => alert.resolved === resolved);
  },

  resolveAlert: async (alertId: string): Promise<LocationAlert> => {
    const index = mockLocationAlerts.findIndex(alert => alert.id === alertId);
    if (index === -1) {
      throw new Error('Alerta no encontrada');
    }

    mockLocationAlerts[index].resolved = true;
    mockLocationAlerts[index].resolvedAt = new Date().toISOString();
    return mockLocationAlerts[index];
  },

  getNearestVehicle: async (
    latitude: number, 
    longitude: number, 
    status: 'available' | 'all' = 'available'
  ): Promise<{vehicle: VehicleLocation, distance: number} | null> => {
    const locations = await locationService.getVehicleLocations();
    
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

// Función auxiliar para calcular la distancia entre dos puntos geográficos
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
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

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Iniciar seguimiento automáticamente
locationService.startTracking();
