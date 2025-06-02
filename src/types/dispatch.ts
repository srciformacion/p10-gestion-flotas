
export interface DispatchEvent {
  id: string;
  type: 'request_created' | 'ambulance_assigned' | 'route_started' | 'emergency' | 'status_update';
  requestId?: string;
  ambulanceId?: string;
  routeId?: string;
  priority: RequestPriority;
  description: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  timestamp: string;
  handledBy?: string;
  resolved: boolean;
}

export interface DispatchRecommendation {
  requestId: string;
  recommendedAmbulances: {
    ambulanceId: string;
    score: number;
    distance: number;
    eta: number;
    reason: string;
  }[];
  alternativeOptions: {
    option: string;
    description: string;
    impact: string;
  }[];
  aiConfidence: number;
}
