
import { Ambulance } from '@/types';

// Mock ambulance data with updated fields
const mockAmbulances: Ambulance[] = [
  {
    id: "AMB-001",
    licensePlate: "1234-AAA",
    model: "Mercedes Sprinter",
    type: "consultation",
    baseLocation: "Logroño",
    hasMedicalBed: true,
    hasWheelchair: true,
    allowsWalking: true,
    stretcherSeats: 1,
    wheelchairSeats: 3,
    walkingSeats: 5,
    equipment: ["stair-chair", "oxygen"],
    zone: "Logroño",
    status: "available",
    notes: "Ambulancia principal para servicios programados"
  },
  {
    id: "AMB-002",
    licensePlate: "5678-BBB",
    model: "Ford Transit",
    type: "consultation",
    baseLocation: "Logroño",
    hasMedicalBed: true,
    hasWheelchair: true,
    allowsWalking: true,
    stretcherSeats: 1,
    wheelchairSeats: 2,
    walkingSeats: 4,
    equipment: ["oxygen"],
    zone: "Logroño",
    status: "available",
    notes: ""
  },
  {
    id: "AMB-003",
    licensePlate: "9012-CCC",
    model: "Volkswagen Crafter",
    type: "emergency",
    baseLocation: "Haro",
    hasMedicalBed: true,
    hasWheelchair: false,
    allowsWalking: true,
    stretcherSeats: 2,
    wheelchairSeats: 1,
    walkingSeats: 3,
    equipment: ["stair-chair", "oxygen", "defibrillator", "bariatric-bed"],
    zone: "Haro",
    status: "available",
    notes: "Equipada para emergencias"
  },
  {
    id: "AMB-004",
    licensePlate: "3456-DDD",
    model: "Fiat Ducato",
    type: "consultation",
    baseLocation: "Calahorra",
    hasMedicalBed: true,
    hasWheelchair: true,
    allowsWalking: true,
    stretcherSeats: 1,
    wheelchairSeats: 2,
    walkingSeats: 4,
    equipment: ["stair-chair"],
    zone: "Calahorra",
    status: "available",
    notes: ""
  },
];

export const ambulancesApi = {
  getAll: async (): Promise<Ambulance[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('ambulances');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialize with mock data if not present
    localStorage.setItem('ambulances', JSON.stringify(mockAmbulances));
    return mockAmbulances;
  },

  getById: async (id: string): Promise<Ambulance | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem('ambulances');
    const ambulances: Ambulance[] = stored ? JSON.parse(stored) : mockAmbulances;
    return ambulances.find(ambulance => ambulance.id === id) || null;
  },

  create: async (ambulance: Omit<Ambulance, 'id'>): Promise<Ambulance> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const newAmbulance: Ambulance = {
      ...ambulance,
      id: `AMB-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    };
    
    const stored = localStorage.getItem('ambulances');
    const ambulances: Ambulance[] = stored ? JSON.parse(stored) : [];
    ambulances.push(newAmbulance);
    localStorage.setItem('ambulances', JSON.stringify(ambulances));
    
    return newAmbulance;
  },

  update: async (id: string, data: Partial<Ambulance>): Promise<Ambulance> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('ambulances');
    const ambulances: Ambulance[] = stored ? JSON.parse(stored) : [];
    const index = ambulances.findIndex(ambulance => ambulance.id === id);
    
    if (index === -1) {
      throw new Error('Ambulance not found');
    }
    
    const updatedAmbulance = {
      ...ambulances[index],
      ...data
    };
    
    ambulances[index] = updatedAmbulance;
    localStorage.setItem('ambulances', JSON.stringify(ambulances));
    
    return updatedAmbulance;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const stored = localStorage.getItem('ambulances');
    const ambulances: Ambulance[] = stored ? JSON.parse(stored) : [];
    const filtered = ambulances.filter(ambulance => ambulance.id !== id);
    localStorage.setItem('ambulances', JSON.stringify(filtered));
  },

  getAvailable: async (
    zone?: string, 
    requiredEquipment?: string[], 
    stretcherSeatsNeeded: number = 0,
    wheelchairSeatsNeeded: number = 0,
    walkingSeatsNeeded: number = 0,
    serviceType?: 'consultation' | 'emergency'
  ): Promise<Ambulance[]> => {
    const allAmbulances = await ambulancesApi.getAll();
    
    return allAmbulances.filter(ambulance => {
      // Filter by status
      if (ambulance.status !== 'available') return false;
      
      // Filter by zone if specified
      if (zone && ambulance.zone !== zone) return false;
      
      // Filter by service type if specified
      if (serviceType && ambulance.type !== serviceType) return false;
      
      // Check if ambulance has required equipment
      if (requiredEquipment && requiredEquipment.length > 0) {
        const hasAllEquipment = requiredEquipment.every(item => 
          ambulance.equipment.includes(item)
        );
        if (!hasAllEquipment) return false;
      }
      
      // Check if ambulance has enough seats
      if (ambulance.stretcherSeats < stretcherSeatsNeeded) return false;
      if (ambulance.wheelchairSeats < wheelchairSeatsNeeded) return false;
      if (ambulance.walkingSeats < walkingSeatsNeeded) return false;
      
      return true;
    });
  }
};
