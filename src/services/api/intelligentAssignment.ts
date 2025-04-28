
import { Assignment, TransportRequest } from '@/types';
import { requestsApi } from './requests';
import { ambulancesApi } from './ambulances';
import { assignmentsApi } from './assignments';
import { 
  extractZoneFromAddress, 
  determineRequiredEquipment,
  calculateEstimatedDuration,
  calculateOccupancyRate 
} from '../utils/assignmentUtils';
import { calculateAmbulanceScore } from '../utils/ambulanceScoring';

export const intelligentAssignmentService = {
  assignAmbulance: async (requestId: string): Promise<Assignment | null> => {
    try {
      const request = await requestsApi.getById(requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      const stretcherSeatsNeeded = request.transportType === 'stretcher' ? 1 : 0;
      const wheelchairSeatsNeeded = request.transportType === 'wheelchair' ? 1 : 0;
      const walkingSeatsNeeded = request.transportType === 'walking' ? 1 : 0;

      const requestZone = extractZoneFromAddress(request.origin);
      const requiredEquipment = determineRequiredEquipment(request);
      const estimatedDuration = calculateEstimatedDuration(request.serviceType);

      let availableAmbulances = await ambulancesApi.getAvailable(
        requestZone,
        requiredEquipment,
        stretcherSeatsNeeded,
        wheelchairSeatsNeeded,
        walkingSeatsNeeded,
        request.serviceType === 'consultation' ? 'consultation' : 'emergency'
      );

      const ambulancesWithoutConflicts = [];
      for (const ambulance of availableAmbulances) {
        const hasConflict = await intelligentAssignmentService.checkForConflicts(
          requestId,
          ambulance.id,
          request.dateTime,
          estimatedDuration
        );
        
        if (!hasConflict) {
          ambulancesWithoutConflicts.push(ambulance);
        }
      }

      if (ambulancesWithoutConflicts.length === 0) {
        console.log('No available ambulances without scheduling conflicts');
        return null;
      }

      const scoredAmbulances = ambulancesWithoutConflicts.map(ambulance => ({
        ambulance,
        score: calculateAmbulanceScore(
          ambulance,
          request,
          requestZone || '',
          stretcherSeatsNeeded,
          wheelchairSeatsNeeded,
          walkingSeatsNeeded
        )
      })).sort((a, b) => b.score - a.score);

      const selectedAmbulance = scoredAmbulances[0].ambulance;

      const assignment: Omit<Assignment, 'id'> = {
        requestId,
        ambulanceId: selectedAmbulance.id,
        assignedAt: new Date().toISOString(),
        occupiedStretcherSeats: stretcherSeatsNeeded,
        occupiedWheelchairSeats: wheelchairSeatsNeeded,
        occupiedWalkingSeats: walkingSeatsNeeded,
        automaticallyAssigned: true,
        status: 'scheduled',
        incidents: []
      };

      const createdAssignment = await assignmentsApi.create(assignment);

      await requestsApi.update(requestId, { 
        status: 'assigned',
        assignedVehicle: selectedAmbulance.id
      });

      await ambulancesApi.update(selectedAmbulance.id, { status: 'busy' });

      await assignmentsApi.recordBiData({
        date: new Date().toISOString(),
        requestId: request.id,
        assignmentId: createdAssignment.id,
        ambulanceId: selectedAmbulance.id,
        serviceType: request.serviceType,
        transportType: request.transportType,
        tripType: request.tripType,
        zone: requestZone || 'Unknown',
        status: 'assigned',
        hadIncidents: false,
        occupancyRate: calculateOccupancyRate(selectedAmbulance, stretcherSeatsNeeded, wheelchairSeatsNeeded, walkingSeatsNeeded)
      });

      return createdAssignment;
    } catch (error) {
      console.error('Error in automatic assignment:', error);
      return null;
    }
  },

  checkForConflicts: async (requestId: string, ambulanceId: string, dateTime: string, estimatedDuration: number = 60): Promise<boolean> => {
    try {
      const request = await requestsApi.getById(requestId);
      if (!request) return false;
      
      const ambulanceAssignments = await assignmentsApi.getByAmbulanceId(ambulanceId);
      
      const requestedStartTime = new Date(dateTime);
      const requestedEndTime = new Date(requestedStartTime.getTime() + estimatedDuration * 60000);
      
      for (const assignment of ambulanceAssignments) {
        if (assignment.status === 'cancelled') continue;
        
        const existingRequest = await requestsApi.getById(assignment.requestId);
        if (!existingRequest) continue;
        
        const existingStartTime = new Date(existingRequest.dateTime);
        const existingEndTime = new Date(existingStartTime.getTime() + estimatedDuration * 60000);
        
        if (
          (requestedStartTime >= existingStartTime && requestedStartTime < existingEndTime) ||
          (requestedEndTime > existingStartTime && requestedEndTime <= existingEndTime) ||
          (requestedStartTime <= existingStartTime && requestedEndTime >= existingEndTime)
        ) {
          return true;
        }
        
        if (existingRequest.tripType === 'roundTrip' && existingRequest.returnDateTime) {
          const returnStartTime = new Date(existingRequest.returnDateTime);
          const returnEndTime = new Date(returnStartTime.getTime() + estimatedDuration * 60000);
          
          if (
            (requestedStartTime >= returnStartTime && requestedStartTime < returnEndTime) ||
            (requestedEndTime > returnStartTime && requestedEndTime <= returnEndTime) ||
            (requestedStartTime <= returnStartTime && requestedEndTime >= returnEndTime)
          ) {
            return true;
          }
        }
        
        if (request.tripType === 'roundTrip' && request.returnDateTime) {
          const returnStartTime = new Date(request.returnDateTime);
          const returnEndTime = new Date(returnStartTime.getTime() + estimatedDuration * 60000);
          
          if (
            (returnStartTime >= existingStartTime && returnStartTime < existingEndTime) ||
            (returnEndTime > existingStartTime && returnEndTime <= existingEndTime) ||
            (returnStartTime <= existingStartTime && returnEndTime >= existingEndTime)
          ) {
            return true;
          }
          
          if (existingRequest.tripType === 'roundTrip' && existingRequest.returnDateTime) {
            const existingReturnStart = new Date(existingRequest.returnDateTime);
            const existingReturnEnd = new Date(existingReturnStart.getTime() + estimatedDuration * 60000);
            
            if (
              (returnStartTime >= existingReturnStart && returnStartTime < existingReturnEnd) ||
              (returnEndTime > existingReturnStart && returnEndTime <= existingReturnEnd) ||
              (returnStartTime <= existingReturnStart && returnEndTime >= existingReturnEnd)
            ) {
              return true;
            }
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking for conflicts:', error);
      return true;
    }
  }
};
