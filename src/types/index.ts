export type UserRole = 
  | 'admin' 
  | 'hospital' 
  | 'individual' 
  | 'ambulance'
  | 'centroCoordinador'
  | 'equipoMovil'
  | 'transport_team';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
  phone?: string;
  organization?: string;
}

export type RequestStatus = 'pending' | 'assigned' | 'inRoute' | 'completed' | 'cancelled';

export interface TransportRequest {
  id: string;
  patientName: string;
  patientId: string; // DNI/NIE o número de SS
  origin: string;
  destination: string;
  responsiblePerson: string;
  dateTime: string;
  transportType: 'stretcher' | 'wheelchair' | 'walking';
  observations: string;
  authorizationFile?: string; // URL del archivo
  status: RequestStatus;
  createdBy: string; // User ID
  assignedVehicle?: string;
  estimatedArrival?: string;
}

// Chat related types
export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  messages: ChatMessage[];
  lastMessageTimestamp: string;
  unreadCount: number;
}
