
import { TransportRequest, Ambulance } from '@/types';

export function extractZoneFromAddress(address: string): string | undefined {
  const knownZones = ['Logroño', 'Haro', 'Calahorra', 'Arnedo', 'Alfaro'];
  return knownZones.find(zone => address.includes(zone));
}

export function determineAmbulanceServiceType(requestServiceType: string): 'consultation' | 'emergency' {
  switch (requestServiceType) {
    case 'consultation':
    case 'discharge':
      return 'consultation';
    case 'admission':
    case 'transfer':
      return 'consultation';
    default:
      return 'consultation';
  }
}

export function determineRequiredEquipment(request: TransportRequest): string[] {
  const equipment: string[] = [];
  
  if (request.specialAttention?.toLowerCase().includes('oxígeno') || 
      request.observations?.toLowerCase().includes('oxígeno')) {
    equipment.push('oxygen');
  }
  
  if (request.architecturalBarriers?.toLowerCase().includes('escalera') || 
      request.observations?.toLowerCase().includes('escalera')) {
    equipment.push('stair-chair');
  }
  
  if (request.requiredEquipment && Array.isArray(request.requiredEquipment)) {
    equipment.push(...request.requiredEquipment);
  }
  
  return equipment;
}

export function calculateOccupancyRate(
  ambulance: Ambulance, 
  stretcherSeats: number, 
  wheelchairSeats: number, 
  walkingSeats: number
): number {
  const totalCapacity = ambulance.stretcherSeats + ambulance.wheelchairSeats + ambulance.walkingSeats;
  const totalUsed = stretcherSeats + wheelchairSeats + walkingSeats;
  return Math.round((totalUsed / totalCapacity) * 100);
}

export function calculateEstimatedDuration(serviceType: string): number {
  switch (serviceType) {
    case 'consultation':
      return 60;
    case 'admission':
      return 90;
    case 'discharge':
      return 60;
    case 'transfer':
      return 120;
    default:
      return 60;
  }
}
