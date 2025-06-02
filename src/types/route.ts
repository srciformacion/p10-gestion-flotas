
export interface RoutePoint {
  lat: number;
  lng: number;
  address: string;
  type: 'pickup' | 'dropoff' | 'waypoint';
  requestId?: string;
  estimatedTime?: string;
  actualTime?: string;
}

export interface Route {
  id: string;
  name: string;
  ambulanceId: string;
  points: RoutePoint[];
  distance: number;
  estimatedDuration: number;
  actualDuration?: number;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  startTime?: string;
  endTime?: string;
  createdBy: string;
  createdAt: string;
  optimized: boolean;
  batchId?: string;
}

export interface RouteOptimization {
  originalRoute: RoutePoint[];
  optimizedRoute: RoutePoint[];
  distanceSaved: number;
  timeSaved: number;
  fuelSaved: number;
}
