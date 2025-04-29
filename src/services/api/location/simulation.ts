
import { GpsLocation, LocationAlert } from '@/types/location';
import { mockLocationAlerts, mockRouteHistory, vehicleLocationsManager } from './types';

export const simulateMovement = () => {
  const vehicles = vehicleLocationsManager.get();
  vehicleLocationsManager.update(vehicles => vehicles.map(vehicle => {
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
  }));
};

// Simular generación de alertas
export const checkForAlerts = () => {
  const vehicles = vehicleLocationsManager.get();
  vehicles.forEach(vehicle => {
    if (!vehicle.inService || !vehicle.assignedToRequestId) return;

    // Simular retraso (1% probabilidad)
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
            vehicleLocationsManager.update(locations => {
              const vehicleIndex = locations.findIndex(v => v.id === vehicle.id);
              if (vehicleIndex !== -1) {
                locations[vehicleIndex].estimatedArrival = 
                  new Date(now.getTime() + 10 * 60 * 1000).toISOString();
              }
              return [...locations];
            });
          }
        }
      }
    }

    // Simular desvío (0.5% probabilidad)
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
