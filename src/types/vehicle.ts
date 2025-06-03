
export interface VehicleDetails {
  id: string;
  vehicleId: string;
  licensePlate: string;
  model: string;
  type: 'Tipo A' | 'Tipo B' | 'Tipo C';
  status: 'available' | 'busy' | 'maintenance' | 'offline';
  currentLocation?: {
    lat: number;
    lng: number;
    address?: string;
    lastUpdated?: string;
  };
  driver?: DriverInfo;
  medic?: MedicInfo;
  equipment: string[];
  capacity: number;
  fuelLevel?: number;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  experience: string;
  rating?: number;
  avatar?: string;
}

export interface MedicInfo {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  experience: string;
  rating?: number;
  avatar?: string;
}
