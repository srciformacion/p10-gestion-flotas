
export interface GpsLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  vehicleId: string;
  speed?: number;
  heading?: number;
}

export interface VehicleLocation {
  id: string;
  licensePlate: string;
  location: GpsLocation;
  status: 'available' | 'busy' | 'maintenance';
  inService: boolean;
  assignedToRequestId?: string;
  estimatedArrival?: string;
}

export interface RouteHistory {
  id: string;
  assignmentId: string;
  vehicleId: string;
  startTime: string;
  endTime?: string;
  points: GpsLocation[];
  completed: boolean;
  distance?: number; // en kilómetros
  duration?: number; // en minutos
}

export interface LocationAlert {
  id: string;
  vehicleId: string;
  requestId: string;
  assignmentId: string;
  type: 'delay' | 'detour' | 'stopped';
  timestamp: string;
  location: GpsLocation;
  details: string;
  resolved: boolean;
  resolvedAt?: string;
}

// Leaflet specific types for internal use
export interface LatLng {
  lat: number;
  lng: number;
}
