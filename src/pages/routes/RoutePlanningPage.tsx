
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Route, 
  MapPin, 
  Clock, 
  Fuel, 
  Plus, 
  Search, 
  Navigation,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface RouteData {
  id: string;
  name: string;
  ambulanceId: string;
  ambulancePlate: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  origin: string;
  destination: string;
  waypoints: string[];
  estimatedTime: number;
  distance: number;
  fuelConsumption: number;
  startTime?: string;
  endTime?: string;
  requests: number;
}

const mockRoutes: RouteData[] = [
  {
    id: '1',
    name: 'Ruta Matutina A',
    ambulanceId: 'AMB-001',
    ambulancePlate: '1234-ABC',
    status: 'active',
    origin: 'Base Central',
    destination: 'Hospital General',
    waypoints: ['Centro de Salud Norte', 'Clínica Santa Ana'],
    estimatedTime: 45,
    distance: 35.5,
    fuelConsumption: 8.2,
    startTime: '08:00',
    requests: 3
  },
  {
    id: '2',
    name: 'Ruta Urgencias B',
    ambulanceId: 'AMB-002',
    ambulancePlate: '5678-DEF',
    status: 'planned',
    origin: 'Hospital General',
    destination: 'Base Central',
    waypoints: ['Urgencias Externas', 'Centro Médico'],
    estimatedTime: 30,
    distance: 22.8,
    fuelConsumption: 5.5,
    requests: 2
  },
  {
    id: '3',
    name: 'Ruta Nocturna C',
    ambulanceId: 'AMB-003',
    ambulancePlate: '9012-GHI',
    status: 'completed',
    origin: 'Base Central',
    destination: 'Base Central',
    waypoints: ['Hospital Regional', 'Centro de Trauma'],
    estimatedTime: 60,
    distance: 48.2,
    fuelConsumption: 11.8,
    startTime: '22:00',
    endTime: '23:15',
    requests: 4
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'planned': return 'bg-blue-100 text-blue-800';
    case 'active': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'planned': return 'Planificada';
    case 'active': return 'En Curso';
    case 'completed': return 'Completada';
    case 'cancelled': return 'Cancelada';
    default: return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'planned': return <Clock className="w-4 h-4" />;
    case 'active': return <Play className="w-4 h-4" />;
    case 'completed': return <CheckCircle className="w-4 h-4" />;
    case 'cancelled': return <AlertCircle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export default function RoutePlanningPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRoutes = mockRoutes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.ambulanceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.ambulancePlate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockRoutes.length,
    active: mockRoutes.filter(r => r.status === 'active').length,
    planned: mockRoutes.filter(r => r.status === 'planned').length,
    completed: mockRoutes.filter(r => r.status === 'completed').length
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-rioja-blue">Planificación de Rutas</h1>
            <p className="text-gray-600 mt-1">Gestiona y optimiza las rutas de ambulancias</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="text-rioja-blue border-rioja-blue hover:bg-rioja-blue/10">
              <RotateCcw className="w-4 h-4 mr-2" />
              Optimizar Rutas
            </Button>
            <Button className="bg-rioja-green hover:bg-rioja-green/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Ruta
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Route className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Rutas</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Play className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En Curso</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Planificadas</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.planned}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completadas</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nombre, ambulancia o matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rioja-green"
          >
            <option value="all">Todos los estados</option>
            <option value="planned">Planificada</option>
            <option value="active">En Curso</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRoutes.map((route) => (
            <Card key={route.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-rioja-blue">{route.name}</CardTitle>
                    <CardDescription>
                      {route.ambulanceId} • {route.ambulancePlate}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(route.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(route.status)}
                      {getStatusText(route.status)}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Route Points */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Origen:</span>
                    <span>{route.origin}</span>
                  </div>
                  
                  {route.waypoints.map((waypoint, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm ml-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-600">Parada {index + 1}:</span>
                      <span>{waypoint}</span>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="font-medium">Destino:</span>
                    <span>{route.destination}</span>
                  </div>
                </div>

                {/* Route Stats */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Tiempo</span>
                    </div>
                    <p className="font-semibold">{route.estimatedTime} min</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <Navigation className="w-4 h-4" />
                      <span>Distancia</span>
                    </div>
                    <p className="font-semibold">{route.distance} km</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <Fuel className="w-4 h-4" />
                      <span>Combustible</span>
                    </div>
                    <p className="font-semibold">{route.fuelConsumption}L</p>
                  </div>
                </div>

                {/* Time Info */}
                <div className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                  <div>
                    <span className="text-gray-600">Solicitudes: </span>
                    <span className="font-semibold">{route.requests}</span>
                  </div>
                  {route.startTime && (
                    <div>
                      <span className="text-gray-600">Inicio: </span>
                      <span className="font-semibold">{route.startTime}</span>
                    </div>
                  )}
                  {route.endTime && (
                    <div>
                      <span className="text-gray-600">Fin: </span>
                      <span className="font-semibold">{route.endTime}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Ver Mapa
                  </Button>
                  {route.status === 'planned' && (
                    <Button size="sm" className="flex-1 bg-rioja-green hover:bg-rioja-green/90">
                      <Play className="w-4 h-4 mr-1" />
                      Iniciar
                    </Button>
                  )}
                  {route.status === 'active' && (
                    <Button variant="outline" size="sm" className="flex-1">
                      <Pause className="w-4 h-4 mr-1" />
                      Pausar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Route className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron rutas que coincidan con los criterios de búsqueda.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
