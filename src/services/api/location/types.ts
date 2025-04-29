
import { GpsLocation, VehicleLocation, RouteHistory, LocationAlert } from '@/types/location';

// Mutable data storage with initial values
export let mockVehicleLocations: VehicleLocation[] = [
  {
    id: "AMB-001",
    licensePlate: "1234-AAA",
    location: {
      latitude: 42.4662,
      longitude: -2.4463,
      timestamp: new Date().toISOString(),
      vehicleId: "AMB-001",
      speed: 30,
      heading: 90
    },
    status: "available",
    inService: false
  },
  {
    id: "AMB-002",
    licensePlate: "5678-BBB",
    location: {
      latitude: 42.4712,
      longitude: -2.4413,
      timestamp: new Date().toISOString(),
      vehicleId: "AMB-002",
      speed: 0,
      heading: 180
    },
    status: "busy",
    inService: true,
    assignedToRequestId: "REQ-12345",
    estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString()
  },
  {
    id: "AMB-003",
    licensePlate: "9012-CCC",
    location: {
      latitude: 42.4612,
      longitude: -2.4513,
      timestamp: new Date().toISOString(),
      vehicleId: "AMB-003",
      speed: 45,
      heading: 270
    },
    status: "busy",
    inService: true,
    assignedToRequestId: "REQ-67890",
    estimatedArrival: new Date(Date.now() + 8 * 60 * 1000).toISOString()
  },
  {
    id: "AMB-004",
    licensePlate: "3456-DDD",
    location: {
      latitude: 42.4552,
      longitude: -2.4383,
      timestamp: new Date().toISOString(),
      vehicleId: "AMB-004",
      speed: 0,
      heading: 0
    },
    status: "maintenance",
    inService: false
  }
];

export let mockRouteHistory: RouteHistory[] = [];
export let mockLocationAlerts: LocationAlert[] = [];

// Simulation interval state management
let _simulationInterval: number | null = null;

export const simulationIntervalManager = {
  get: () => _simulationInterval,
  set: (value: number | null) => {
    _simulationInterval = value;
  }
};

// Vehicle locations state management
export const vehicleLocationsManager = {
  get: () => mockVehicleLocations,
  set: (locations: VehicleLocation[]) => {
    mockVehicleLocations = locations;
  },
  update: (updater: (locations: VehicleLocation[]) => VehicleLocation[]) => {
    mockVehicleLocations = updater(mockVehicleLocations);
  }
};
