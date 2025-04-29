
import { simulateMovement, checkForAlerts } from './simulation';
import { simulationInterval } from './types';
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
  }
};

// Iniciar seguimiento automáticamente
locationService.startTracking();
