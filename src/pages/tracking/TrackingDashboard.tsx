
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Zap,
  RefreshCw,
  Filter,
  Radio
} from 'lucide-react';

interface VehicleTracking {
  id: string;
  vehicleId: string;
  licensePlate: string;
  status: 'active' | 'idle' | 'emergency' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  speed: number;
  heading: number;
  lastUpdate: string;
  currentRequest?: string;
  estimatedArrival?: string;
  batteryLevel?: number;
  signal: 'excellent' | 'good' | 'fair' | 'poor';
}

const mockVehicles: VehicleTracking[] = [
  {
    id: '1',
    vehicleId: 'AMB-001',
    licensePlate: '1234-ABC',
    status: 'active',
    location: {
      lat: 40.4168,
      lng: -3.7038,
      address: 'Calle Gran Vía, 28, Madrid'
    },
    speed: 45,
    heading: 120,
    lastUpdate: '2024-01-20T10:30:00Z',
    currentRequest: 'REQ-2024-001',
    estimatedArrival: '15 min',
    batteryLevel: 85,
    signal: 'excellent'
  },
  {
    id: '2',
    vehicleId: 'AMB-002',
    licensePlate: '5678-DEF',
    status: 'idle',
    location: {
      lat: 40.4000,
      lng: -3.6800,
      address: 'Hospital General, Madrid'
    },
    speed: 0,
    heading: 0,
    lastUpdate: '2024-01-20T10:28:00Z',
    batteryLevel: 92,
    signal: 'good'
  },
  {
    id: '3',
    vehicleId: 'AMB-003',
    licensePlate: '9012-GHI',
    status: 'emergency',
    location: {
      lat: 40.4300,
      lng: -3.6900,
      address: 'Avenida de la Castellana, Madrid'
    },
    speed: 65,
    heading: 280,
    lastUpdate: '2024-01-20T10:31:00Z',
    currentRequest: 'REQ-2024-002',
    estimatedArrival: '8 min',
    batteryLevel: 78,
    signal: 'excellent'
  },
  {
    id: '4',
    vehicleId: 'AMB-004',
    licensePlate: '3456-JKL',
    status: 'offline',
    location: {
      lat: 40.3900,
      lng: -3.7100,
      address: 'Base Central, Madrid'
    },
    speed: 0,
    heading: 0,
    lastUpdate: '2024-01-20T09:45:00Z',
    batteryLevel: 45,
    signal: 'poor'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-blue-100 text-blue-800';
    case 'idle': return 'bg-green-100 text-green-800';
    case 'emergency': return 'bg-red-100 text-red-800';
    case 'offline': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'active': return 'En Servicio';
    case 'idle': return 'Disponible';
    case 'emergency': return 'Emergencia';
    case 'offline': return 'Desconectada';
    default: return status;
  }
};

const getSignalColor = (signal: string) => {
  switch (signal) {
    case 'excellent': return 'text-green-600';
    case 'good': return 'text-blue-600';
    case 'fair': return 'text-yellow-600';
    case 'poor': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getSignalBars = (signal: string) => {
  switch (signal) {
    case 'excellent': return 4;
    case 'good': return 3;
    case 'fair': return 2;
    case 'poor': return 1;
    default: return 0;
  }
};

export default function TrackingDashboard() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const filteredVehicles = mockVehicles.filter(vehicle => 
    statusFilter === 'all' || vehicle.status === statusFilter
  );

  const stats = {
    total: mockVehicles.length,
    active: mockVehicles.filter(v => v.status === 'active').length,
    emergency: mockVehicles.filter(v => v.status === 'emergency').length,
    offline: mockVehicles.filter(v => v.status === 'offline').length
  };

  const formatLastUpdate = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Ahora';
    if (minutes === 1) return 'Hace 1 min';
    return `Hace ${minutes} min`;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-rioja-blue">Seguimiento en Tiempo Real</h1>
            <p className="text-gray-600 mt-1">Monitorea la ubicación y estado de todas las ambulancias</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? "bg-rioja-green hover:bg-rioja-green/90" : ""}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto-refresh
            </Button>
            <Button variant="outline" className="text-rioja-blue border-rioja-blue hover:bg-rioja-blue/10">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Vehículos</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Navigation className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En Servicio</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Zap className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Emergencias</p>
                  <p className="text-2xl font-bold text-red-600">{stats.emergency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Desconectadas</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.offline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Filter */}
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rioja-green"
          >
            <option value="all">Todos los estados</option>
            <option value="active">En Servicio</option>
            <option value="idle">Disponible</option>
            <option value="emergency">Emergencia</option>
            <option value="offline">Desconectada</option>
          </select>
        </div>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mapa en Tiempo Real
            </CardTitle>
            <CardDescription>
              Vista general de todas las ambulancias activas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Mapa interactivo de seguimiento</p>
                <p className="text-sm text-gray-500 mt-2">
                  Integración con servicio de mapas pendiente
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-rioja-blue">{vehicle.vehicleId}</CardTitle>
                    <CardDescription>{vehicle.licensePlate}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge className={getStatusColor(vehicle.status)}>
                      {getStatusText(vehicle.status)}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Radio className={`w-4 h-4 ${getSignalColor(vehicle.signal)}`} />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            className={`w-1 h-3 rounded-sm ${
                              bar <= getSignalBars(vehicle.signal)
                                ? getSignalColor(vehicle.signal).replace('text-', 'bg-')
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{vehicle.location.address}</p>
                    <p className="text-xs text-gray-500">
                      {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Velocidad</p>
                    <p className="font-semibold">{vehicle.speed} km/h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rumbo</p>
                    <p className="font-semibold">{vehicle.heading}°</p>
                  </div>
                </div>

                {vehicle.currentRequest && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Solicitud Activa</p>
                        <p className="text-sm text-blue-700">{vehicle.currentRequest}</p>
                      </div>
                      {vehicle.estimatedArrival && (
                        <div className="text-right">
                          <p className="text-xs text-blue-600">ETA</p>
                          <p className="text-sm font-semibold text-blue-900">{vehicle.estimatedArrival}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-gray-600">Batería: </span>
                    <span className={`font-semibold ${
                      vehicle.batteryLevel && vehicle.batteryLevel > 50 ? 'text-green-600' :
                      vehicle.batteryLevel && vehicle.batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {vehicle.batteryLevel}%
                    </span>
                  </div>
                  <div className="text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {formatLastUpdate(vehicle.lastUpdate)}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Centrar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Navigation className="w-4 h-4 mr-1" />
                    Historial
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron vehículos con el filtro seleccionado.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
