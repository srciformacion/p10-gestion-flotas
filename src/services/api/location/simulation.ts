
import { mockVehicleLocations, mockLocationAlerts, vehicleLocationsManager } from './types';
import { getRandomNearbyPoint, calculateDistance, calculateHeading, generateUUID } from './utils';
import { LocationAlert } from '@/types/location';

// Simular el movimiento de vehículos para probar el sistema
export function simulateMovement(): void {
  const currentLocations = vehicleLocationsManager.get();

  vehicleLocationsManager.update(locations => {
    return locations.map(vehicle => {
      // Solo mover vehículos disponibles o en servicio
      if (vehicle.status === 'maintenance') {
        return vehicle;
      }

      // Obtener un punto cercano aleatorio
      const currentPos = {
        lat: vehicle.location.latitude,
        lng: vehicle.location.longitude
      };

      // Simular movimiento más agresivo para vehículos en servicio
      const movementRadius = vehicle.inService ? 0.003 : 0.001;
      const newPos = getRandomNearbyPoint(currentPos, movementRadius);

      // Calcular nueva velocidad - entre 0 y 80 km/h
      const speed = vehicle.inService ? 
        Math.random() * 60 + 20 : // 20-80 km/h en servicio
        Math.random() * 20;       // 0-20 km/h en espera

      // Calcular rumbo basado en el movimiento
      const heading = calculateHeading(
        currentPos.lat, 
        currentPos.lng, 
        newPos.lat, 
        newPos.lng
      );

      return {
        ...vehicle,
        location: {
          ...vehicle.location,
          latitude: newPos.lat,
          longitude: newPos.lng,
          timestamp: new Date().toISOString(),
          speed: speed,
          heading: heading
        }
      };
    });
  });
}

// Verificar si hay condiciones para generar alertas
export function checkForAlerts(): void {
  const vehicles = vehicleLocationsManager.get();
  
  vehicles.forEach(vehicle => {
    // Solo verificar vehículos en servicio
    if (!vehicle.inService || !vehicle.assignedToRequestId) return;
    
    const speed = vehicle.location.speed || 0;
    
    // Alerta por detenido
    if (vehicle.status === 'busy' && speed < 5) {
      const stoppedAlert: LocationAlert = {
        id: generateUUID(),
        vehicleId: vehicle.id,
        requestId: vehicle.assignedToRequestId,
        assignmentId: `ASN-${vehicle.assignedToRequestId}`,
        type: 'stopped',
        timestamp: new Date().toISOString(),
        location: {
          latitude: vehicle.location.latitude,
          longitude: vehicle.location.longitude,
          timestamp: vehicle.location.timestamp,
          vehicleId: vehicle.id,
          speed: speed,
          heading: vehicle.location.heading
        },
        details: `Vehículo ${vehicle.id} detenido durante más de 3 minutos`,
        resolved: false
      };
      
      // Verificar si ya existe esta alerta
      const existingAlert = mockLocationAlerts.some(
        alert => alert.vehicleId === vehicle.id && 
                alert.type === 'stopped' && 
                !alert.resolved
      );
      
      // Solo agregar si no existe y con probabilidad baja para no generar muchas alertas
      if (!existingAlert && Math.random() < 0.05) {
        mockLocationAlerts.push(stoppedAlert);
      }
    }
    
    // Alerta por desvío
    if (vehicle.status === 'busy' && Math.random() < 0.02) {
      const detourAlert: LocationAlert = {
        id: generateUUID(),
        vehicleId: vehicle.id,
        requestId: vehicle.assignedToRequestId,
        assignmentId: `ASN-${vehicle.assignedToRequestId}`,
        type: 'detour',
        timestamp: new Date().toISOString(),
        location: {
          latitude: vehicle.location.latitude,
          longitude: vehicle.location.longitude,
          timestamp: vehicle.location.timestamp,
          vehicleId: vehicle.id,
          speed: speed,
          heading: vehicle.location.heading
        },
        details: `Vehículo ${vehicle.id} desviado de la ruta planificada`,
        resolved: false
      };
      
      // Verificar si ya existe esta alerta
      const existingAlert = mockLocationAlerts.some(
        alert => alert.vehicleId === vehicle.id && 
                alert.type === 'detour' && 
                !alert.resolved
      );
      
      // Solo agregar si no existe
      if (!existingAlert) {
        mockLocationAlerts.push(detourAlert);
      }
    }
    
    // Alerta por retraso
    if (vehicle.estimatedArrival && Math.random() < 0.01) {
      const now = new Date();
      const eta = new Date(vehicle.estimatedArrival);
      
      // Si la fecha estimada ya pasó
      if (now > eta) {
        const delayAlert: LocationAlert = {
          id: generateUUID(),
          vehicleId: vehicle.id,
          requestId: vehicle.assignedToRequestId,
          assignmentId: `ASN-${vehicle.assignedToRequestId}`,
          type: 'delay',
          timestamp: now.toISOString(),
          location: {
            latitude: vehicle.location.latitude,
            longitude: vehicle.location.longitude,
            timestamp: vehicle.location.timestamp,
            vehicleId: vehicle.id,
            speed: speed,
            heading: vehicle.location.heading
          },
          details: `Vehículo ${vehicle.id} retrasado en su llegada estimada`,
          resolved: false
        };
        
        // Verificar si ya existe esta alerta
        const existingAlert = mockLocationAlerts.some(
          alert => alert.vehicleId === vehicle.id && 
                  alert.type === 'delay' && 
                  !alert.resolved
        );
        
        // Solo agregar si no existe
        if (!existingAlert) {
          mockLocationAlerts.push(delayAlert);
        }
      }
    }
  });
}
