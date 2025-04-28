
import { Assignment, AssignmentIncident, BiRecord, TransportRequest } from '@/types';
import { requestsApi } from './requests';
import { ambulancesApi } from './ambulances';

export const assignmentsApi = {
  getAll: async (): Promise<Assignment[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('assignments');
    return stored ? JSON.parse(stored) : [];
  },

  getById: async (id: string): Promise<Assignment | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const stored = localStorage.getItem('assignments');
    const assignments: Assignment[] = stored ? JSON.parse(stored) : [];
    return assignments.find(assignment => assignment.id === id) || null;
  },

  create: async (assignment: Omit<Assignment, 'id'>): Promise<Assignment> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    const newAssignment: Assignment = {
      ...assignment,
      id: crypto.randomUUID(),
    };
    
    const stored = localStorage.getItem('assignments');
    const assignments: Assignment[] = stored ? JSON.parse(stored) : [];
    assignments.push(newAssignment);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    return newAssignment;
  },

  update: async (id: string, data: Partial<Assignment>): Promise<Assignment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const stored = localStorage.getItem('assignments');
    const assignments: Assignment[] = stored ? JSON.parse(stored) : [];
    const index = assignments.findIndex(assignment => assignment.id === id);
    
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    
    const updatedAssignment = {
      ...assignments[index],
      ...data
    };
    
    assignments[index] = updatedAssignment;
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    return updatedAssignment;
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const stored = localStorage.getItem('assignments');
    const assignments: Assignment[] = stored ? JSON.parse(stored) : [];
    const filtered = assignments.filter(assignment => assignment.id !== id);
    localStorage.setItem('assignments', JSON.stringify(filtered));
  },

  getByRequestId: async (requestId: string): Promise<Assignment | null> => {
    const allAssignments = await assignmentsApi.getAll();
    return allAssignments.find(assignment => assignment.requestId === requestId) || null;
  },

  getByAmbulanceId: async (ambulanceId: string): Promise<Assignment[]> => {
    const allAssignments = await assignmentsApi.getAll();
    return allAssignments.filter(assignment => assignment.ambulanceId === ambulanceId);
  },

  addIncident: async (assignmentId: string, incident: Omit<AssignmentIncident, 'id' | 'assignmentId'>): Promise<AssignmentIncident> => {
    const assignment = await assignmentsApi.getById(assignmentId);
    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const newIncident: AssignmentIncident = {
      id: crypto.randomUUID(),
      assignmentId,
      ...incident
    };

    const incidents = assignment.incidents || [];
    incidents.push(newIncident);

    await assignmentsApi.update(assignmentId, { incidents });
    return newIncident;
  },

  recordBiData: async (data: Omit<BiRecord, 'id'>): Promise<BiRecord> => {
    const newRecord: BiRecord = {
      ...data,
      id: crypto.randomUUID(),
    };

    const stored = localStorage.getItem('bi_records');
    const records: BiRecord[] = stored ? JSON.parse(stored) : [];
    records.push(newRecord);
    localStorage.setItem('bi_records', JSON.stringify(records));

    return newRecord;
  },
};

// Intelligent assignment service
export const intelligentAssignmentService = {
  // Automatically assign an ambulance to a request
  assignAmbulance: async (requestId: string): Promise<Assignment | null> => {
    try {
      // Get the request details
      const request = await requestsApi.getById(requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      // Calculate seats needed based on transport type
      const stretcherSeatsNeeded = request.transportType === 'stretcher' ? 1 : 0;
      const wheelchairSeatsNeeded = request.transportType === 'wheelchair' ? 1 : 0;
      const walkingSeatsNeeded = request.transportType === 'walking' ? 1 : 0;

      // Extract zone from origin (simplified logic - in production would use geocoding)
      const requestZone = extractZoneFromAddress(request.origin);
      
      // Determine service type for ambulance type matching
      const ambulanceServiceType = determineAmbulanceServiceType(request.serviceType);
      
      // Get required equipment based on notes and special attention
      const requiredEquipment = determineRequiredEquipment(request);

      // Find available ambulances matching the criteria
      const availableAmbulances = await ambulancesApi.getAvailable(
        requestZone,
        requiredEquipment,
        stretcherSeatsNeeded,
        wheelchairSeatsNeeded,
        walkingSeatsNeeded,
        ambulanceServiceType
      );

      if (availableAmbulances.length === 0) {
        console.log('No available ambulances matching criteria');
        return null;
      }

      // For now, simply take the first available ambulance
      // In a real system, you would use more sophisticated algorithms
      const selectedAmbulance = availableAmbulances[0];

      // Create the assignment
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

      // Update the request status
      await requestsApi.update(requestId, { 
        status: 'assigned',
        assignedVehicle: selectedAmbulance.id
      });

      // Update ambulance status
      await ambulancesApi.update(selectedAmbulance.id, { status: 'busy' });

      // Create BI record
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

  // Check for scheduling conflicts with existing assignments
  checkForConflicts: async (requestId: string, ambulanceId: string, dateTime: string, estimatedDuration: number = 60): Promise<boolean> => {
    try {
      const request = await requestsApi.getById(requestId);
      if (!request) return false;
      
      const ambulanceAssignments = await assignmentsApi.getByAmbulanceId(ambulanceId);
      
      // Convert the requested datetime to Date object
      const requestedStartTime = new Date(dateTime);
      const requestedEndTime = new Date(requestedStartTime.getTime() + estimatedDuration * 60000);
      
      // Check for conflicts with existing assignments
      for (const assignment of ambulanceAssignments) {
        if (assignment.status === 'cancelled') continue;
        
        const existingRequest = await requestsApi.getById(assignment.requestId);
        if (!existingRequest) continue;
        
        const existingStartTime = new Date(existingRequest.dateTime);
        
        // Estimate end time based on typical service duration (would be more precise in production)
        const existingEndTime = new Date(existingStartTime.getTime() + estimatedDuration * 60000);
        
        // Check for overlap
        if (
          (requestedStartTime >= existingStartTime && requestedStartTime < existingEndTime) ||
          (requestedEndTime > existingStartTime && requestedEndTime <= existingEndTime) ||
          (requestedStartTime <= existingStartTime && requestedEndTime >= existingEndTime)
        ) {
          return true; // Conflict detected
        }
        
        // Check for round trips if applicable
        if (existingRequest.tripType === 'roundTrip' && existingRequest.returnDateTime) {
          const returnStartTime = new Date(existingRequest.returnDateTime);
          const returnEndTime = new Date(returnStartTime.getTime() + estimatedDuration * 60000);
          
          if (
            (requestedStartTime >= returnStartTime && requestedStartTime < returnEndTime) ||
            (requestedEndTime > returnStartTime && requestedEndTime <= returnEndTime) ||
            (requestedStartTime <= returnStartTime && requestedEndTime >= returnEndTime)
          ) {
            return true; // Conflict detected with return trip
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
            return true; // Conflict detected for our return trip
          }
          
          // Check against existing return trips too
          if (existingRequest.tripType === 'roundTrip' && existingRequest.returnDateTime) {
            const existingReturnStart = new Date(existingRequest.returnDateTime);
            const existingReturnEnd = new Date(existingReturnStart.getTime() + estimatedDuration * 60000);
            
            if (
              (returnStartTime >= existingReturnStart && returnStartTime < existingReturnEnd) ||
              (returnEndTime > existingReturnStart && returnEndTime <= existingReturnEnd) ||
              (returnStartTime <= existingReturnStart && returnEndTime >= existingReturnEnd)
            ) {
              return true; // Conflict detected between return trips
            }
          }
        }
      }
      
      return false; // No conflicts
    } catch (error) {
      console.error('Error checking for conflicts:', error);
      return true; // Assume conflict on error to be safe
    }
  }
};

// Helper functions for the assignment service
function extractZoneFromAddress(address: string): string | undefined {
  // In a real system, this would use geocoding
  // For this demo, just check if major zones are mentioned in the address
  const knownZones = ['Logroño', 'Haro', 'Calahorra', 'Arnedo', 'Alfaro'];
  const foundZone = knownZones.find(zone => address.includes(zone));
  return foundZone;
}

function determineAmbulanceServiceType(requestServiceType: string): 'consultation' | 'emergency' {
  // Map request service types to ambulance types
  switch (requestServiceType) {
    case 'consultation':
    case 'discharge':
      return 'consultation';
    case 'admission':
    case 'transfer':
      // This logic can be more complex based on patient condition
      return 'consultation';
    default:
      return 'consultation';
  }
}

function determineRequiredEquipment(request: TransportRequest): string[] {
  const equipment: string[] = [];
  
  // Check if special equipment is needed based on request data
  if (request.specialAttention?.toLowerCase().includes('oxígeno') || 
      request.observations?.toLowerCase().includes('oxígeno')) {
    equipment.push('oxygen');
  }
  
  if (request.architecturalBarriers?.toLowerCase().includes('escalera') || 
      request.observations?.toLowerCase().includes('escalera')) {
    equipment.push('stair-chair');
  }
  
  // Additional equipment based on request properties
  if (request.requiredEquipment && Array.isArray(request.requiredEquipment)) {
    equipment.push(...request.requiredEquipment);
  }
  
  return equipment;
}

function calculateOccupancyRate(
  ambulance: any, 
  stretcherSeats: number, 
  wheelchairSeats: number, 
  walkingSeats: number
): number {
  const totalCapacity = ambulance.stretcherSeats + ambulance.wheelchairSeats + ambulance.walkingSeats;
  const totalUsed = stretcherSeats + wheelchairSeats + walkingSeats;
  
  return Math.round((totalUsed / totalCapacity) * 100);
}
