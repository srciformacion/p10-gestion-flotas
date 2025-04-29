
import { RouteHistory } from '@/types/location';
import { mockRouteHistory } from './types';

export const routeService = {
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
  }
};
