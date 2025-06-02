
export type RequestStatus = 'pending' | 'assigned' | 'inRoute' | 'completed' | 'cancelled';
export type RequestPriority = 'low' | 'medium' | 'high' | 'emergency';
export type TransportType = 'stretcher' | 'wheelchair' | 'walking';
export type RequestType = 'simple' | 'scheduled' | 'advanced';

export interface TransportRequest {
  id: string;
  type: RequestType;
  patientName: string;
  patientId: string;
  responsiblePerson: string;
  origin: string;
  destination: string;
  dateTime: string;
  transportType: TransportType;
  status: RequestStatus;
  priority: RequestPriority;
  specialRequirements?: string;
  medicalCondition?: string;
  observations?: string;
  authorizationFile?: string;
  assignedAmbulance?: string;
  assignedRoute?: string;
  estimatedArrival?: string;
  actualArrival?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  architecturalBarriers?: string;
  specialAttention?: string;
  contactPhone?: string;
  emergencyContact?: string;
  insurance?: string;
}

export interface RequestBatch {
  id: string;
  name: string;
  description?: string;
  requests: string[];
  assignedAmbulances: string[];
  scheduledDate: string;
  status: 'draft' | 'planned' | 'active' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: string;
  estimatedDuration?: number;
  totalDistance?: number;
}
