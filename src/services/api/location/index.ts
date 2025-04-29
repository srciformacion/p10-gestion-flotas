
import { simulateMovement, checkForAlerts } from './simulation';
import { simulationIntervalManager } from './types';
import { vehicleService } from './vehicleService';
import { routeService } from './routeService';
import { alertService } from './alertService';

export const locationService = {
  // Re-export services
  ...vehicleService,
  ...routeService,
  ...alertService,
  
  // Simulation control methods
  startTracking: () => {
    if (simulationIntervalManager.get() === null) {
      // Actualizar posiciones cada 5 segundos para la simulación
      const intervalId = window.setInterval(() => {
        simulateMovement();
        checkForAlerts();
      }, 5000);
      
      simulationIntervalManager.set(intervalId);
    }
  },

  stopTracking: () => {
    const currentInterval = simulationIntervalManager.get();
    if (currentInterval !== null) {
      clearInterval(currentInterval);
      simulationIntervalManager.set(null);
    }
  }
};

// Iniciar seguimiento automáticamente
locationService.startTracking();
