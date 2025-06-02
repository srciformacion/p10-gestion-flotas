
export type AmbulanceStatus = 'available' | 'busy' | 'maintenance' | 'offline';
export type AmbulanceType = 'Tipo A' | 'Tipo B' | 'Tipo C';

export interface Ambulance {
  id: string;
  vehicleId: string;
  licensePlate: string;
  model: string;
  type: AmbulanceType;
  status: AmbulanceStatus;
  equipment: string[];
  currentLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  assignedDriver?: string;
  assignedMedic?: string;
  capacity: number;
  fuelLevel?: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AmbulanceTracking {
  ambulanceId: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  speed?: number;
  heading?: number;
  status: AmbulanceStatus;
}
