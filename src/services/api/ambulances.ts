
import { Ambulance, AmbulanceTracking } from '@/types/ambulance';
import { mockAmbulances } from './mock-data';

class AmbulanceService {
  private ambulances: Ambulance[] = [...mockAmbulances];
  private tracking: AmbulanceTracking[] = [];

  async getAll(): Promise<Ambulance[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.ambulances;
  }

  async getById(id: string): Promise<Ambulance | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.ambulances.find(amb => amb.id === id) || null;
  }

  async create(ambulanceData: Omit<Ambulance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Ambulance> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAmbulance: Ambulance = {
      ...ambulanceData,
      id: `amb-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.ambulances.push(newAmbulance);
    return newAmbulance;
  }

  async update(id: string, updates: Partial<Ambulance>): Promise<Ambulance> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = this.ambulances.findIndex(amb => amb.id === id);
    if (index === -1) {
      throw new Error('Ambulancia no encontrada');
    }
    
    this.ambulances[index] = {
      ...this.ambulances[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return this.ambulances[index];
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.ambulances.findIndex(amb => amb.id === id);
    if (index === -1) {
      throw new Error('Ambulancia no encontrada');
    }
    
    this.ambulances.splice(index, 1);
  }

  async updateLocation(ambulanceId: string, location: { lat: number; lng: number }): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const tracking: AmbulanceTracking = {
      ambulanceId,
      location,
      timestamp: new Date().toISOString(),
      status: 'available'
    };
    
    this.tracking.push(tracking);
    
    // Actualizar la ubicación actual de la ambulancia
    const ambulance = this.ambulances.find(amb => amb.id === ambulanceId);
    if (ambulance) {
      ambulance.currentLocation = { ...location };
      ambulance.updatedAt = new Date().toISOString();
    }
  }

  async getTracking(ambulanceId: string): Promise<AmbulanceTracking[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.tracking.filter(t => t.ambulanceId === ambulanceId);
  }

  async getAvailableAmbulances(): Promise<Ambulance[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return this.ambulances.filter(amb => amb.status === 'available');
  }
}

export const ambulanceApi = new AmbulanceService();
