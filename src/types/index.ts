export type UserRole = 'admin' | 'hospital' | 'individual' | 'ambulance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  vehicle_id?: string; // Added vehicle_id
}

export type RequestStatus = 'pending' | 'assigned' | 'inRoute' | 'completed' | 'cancelled';

export type TransportType = 'stretcher' | 'wheelchair' | 'walking';
export type TripType = 'oneWay' | 'roundTrip';
export type ServiceType = 'consultation' | 'admission' | 'discharge' | 'transfer';
export type RecurrenceType = 'dateRange' | 'weekly';

export interface TransportRequest {
  id: string;
  patientName: string;
  patientId: string; // DNI/NIE o número de SS
  origin: string;
  destination: string;
  responsiblePerson: string;
  dateTime: string;
  returnDateTime?: string; // For round trips
  transportType: TransportType;
  serviceType: ServiceType;
  tripType: TripType;
  observations: string;
  authorizationFile?: string; // URL del archivo
  status: RequestStatus;
  createdBy: string; // User ID
  assignedVehicle?: string;
  estimatedArrival?: string;
  architecturalBarriers?: string;
  specialAttention?: string;
  requiredEquipment?: string[];
  zone?: string; // Area of service (e.g., "Logroño")
  isAdvancedRequest?: boolean;
  advancedRequestDetails?: AdvancedRequestDetails;
}

export interface AdvancedRequestDetails {
  recurrenceType: RecurrenceType;
  startDate: string;
  endDate: string;
  weekdays: string[];
  excludeHolidays: boolean;
}

// Ambulance related types
export interface Ambulance {
  id: string;
  licensePlate: string;
  model: string;
  type: 'consultation' | 'emergency';
  baseLocation: string;
  hasMedicalBed: boolean;
  hasWheelchair: boolean;
  allowsWalking: boolean;
  stretcherSeats: number;
  wheelchairSeats: number;
  walkingSeats: number;
  equipment: string[]; // Equipment like "stair-chair", "bariatric-bed", etc.
  zone: string; // Operating area like "Logroño", "Haro", etc.
  status: 'available' | 'busy' | 'maintenance';
  currentLocation?: string;
  notes?: string;
}

// Assignment related types
export interface Assignment {
  id: string;
  requestId: string;
  ambulanceId: string;
  assignedAt: string;
  pickupTime?: string; // Real pickup time
  deliveryTime?: string; // Real delivery time
  returnPickupTime?: string; // For round trips
  returnDeliveryTime?: string; // For round trips
  distance?: number; // in kilometers
  duration?: number; // in minutes
  occupiedStretcherSeats: number;
  occupiedWheelchairSeats: number;
  occupiedWalkingSeats: number;
  incidents?: AssignmentIncident[];
  automaticallyAssigned: boolean; // Whether it was assigned by the system or manually
  status: 'scheduled' | 'inProgress' | 'completed' | 'cancelled';
}

export interface AssignmentIncident {
  id: string;
  assignmentId: string;
  type: 'delay' | 'vehicleChange' | 'routeChange' | 'other';
  description: string;
  timestamp: string;
  resolvedAt?: string;
  severity: 'low' | 'medium' | 'high';
}

// Business Intelligence data
export interface BiRecord {
  id: string;
  date: string;
  requestId: string;
  assignmentId?: string;
  ambulanceId?: string;
  serviceType: ServiceType;
  transportType: TransportType;
  tripType: TripType;
  zone: string;
  status: RequestStatus;
  pickupTime?: string;
  deliveryTime?: string;
  distance?: number;
  duration?: number;
  delayMinutes?: number;
  hadIncidents: boolean;
  rejectionReason?: string;
  occupancyRate?: number; // Percentage of ambulance capacity used
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

// Nuevas interfaces para trabajar con Supabase
export interface Organization {
  id: string;
  name: string;
  type: string;
  address?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  license_plate: string;
  model: string;
  organization_id: string;
  vehicle_type: string;
  capacity: number;
  equipment?: string[];
  status: 'available' | 'busy' | 'maintenance';
  in_service: boolean;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  organization_id?: string;
  address?: string;
  is_verified: boolean;
  dni: string;
  phone: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  vehicle_id?: string; // Added vehicle_id
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_to?: string;
  related_id?: string;
  read: boolean;
  created_at: string;
}

export interface LocationAlert {
  id: string;
  vehicle_id: string;
  request_id: string;
  assignment_id: string;
  type: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  details?: string;
  resolved: boolean;
  resolved_at?: string;
}
