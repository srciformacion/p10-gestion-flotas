
import { Ambulance, TransportRequest } from '@/types';
import { determineRequiredEquipment } from './assignmentUtils';

export function calculateAmbulanceScore(
  ambulance: Ambulance,
  request: TransportRequest,
  requestZone: string,
  stretcherNeeded: number,
  wheelchairNeeded: number,
  walkingNeeded: number
): number {
  let score = 0;

  // Zone match (highest priority)
  if (ambulance.zone === requestZone) {
    score += 100;
  }

  // Equipment match
  const requiredEquipment = determineRequiredEquipment(request);
  const equipmentScore = requiredEquipment.reduce((acc, equipment) => {
    return acc + (ambulance.equipment.includes(equipment) ? 10 : 0);
  }, 0);
  score += equipmentScore;

  // Capacity optimization
  const totalCapacity = ambulance.stretcherSeats + ambulance.wheelchairSeats + ambulance.walkingSeats;
  const neededCapacity = stretcherNeeded + wheelchairNeeded + walkingNeeded;
  const capacityRatio = neededCapacity / totalCapacity;
  
  if (capacityRatio >= 0.5 && capacityRatio <= 0.8) {
    score += 50;
  } else if (capacityRatio > 0.8) {
    score += 30;
  } else {
    score += 20;
  }

  // Service type match
  if (
    (request.serviceType === 'consultation' && ambulance.type === 'consultation') ||
    (request.serviceType === 'admission' && ambulance.type === 'emergency')
  ) {
    score += 40;
  }

  return score;
}
