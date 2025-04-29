
import { LocationAlert } from '@/types/location';
import { mockLocationAlerts } from './types';

export const alertService = {
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
  }
};
