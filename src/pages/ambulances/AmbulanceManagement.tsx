
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Ambulance, 
  MapPin, 
  Fuel, 
  Settings, 
  Plus, 
  Search,
  Filter,
  Activity,
  Users,
  Wrench
} from 'lucide-react';

interface AmbulanceData {
  id: string;
  vehicleId: string;
  licensePlate: string;
  model: string;
  type: 'Tipo A' | 'Tipo B' | 'Tipo C';
  status: 'available' | 'busy' | 'maintenance' | 'offline';
  currentLocation: string;
  fuelLevel: number;
  driver?: string;
  medic?: string;
  lastMaintenance: string;
}

const mockAmbulances: AmbulanceData[] = [
  {
    id: '1',
    vehicleId: 'AMB-001',
    licensePlate: '1234-ABC',
    model: 'Mercedes Sprinter 2023',
    type: 'Tipo B',
    status: 'available',
    currentLocation: 'Base Central',
    fuelLevel: 85,
    driver: 'Juan Pérez',
    medic: 'Dra. María González',
    lastMaintenance: '2024-01-15'
  },
  {
    id: '2',
    vehicleId: 'AMB-002',
    licensePlate: '5678-DEF',
    model: 'Ford Transit 2022',
    type: 'Tipo A',
    status: 'busy',
    currentLocation: 'Hospital General',
    fuelLevel: 62,
    driver: 'Carlos López',
    lastMaintenance: '2024-01-10'
  },
  {
    id: '3',
    vehicleId: 'AMB-003',
    licensePlate: '9012-GHI',
    model: 'Iveco Daily 2023',
    type: 'Tipo C',
    status: 'maintenance',
    currentLocation: 'Taller',
    fuelLevel: 45,
    lastMaintenance: '2024-01-05'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available': return 'bg-green-100 text-green-800';
    case 'busy': return 'bg-yellow-100 text-yellow-800';
    case 'maintenance': return 'bg-red-100 text-red-800';
    case 'offline': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'available': return 'Disponible';
    case 'busy': return 'Ocupada';
    case 'maintenance': return 'Mantenimiento';
    case 'offline': return 'Fuera de servicio';
    default: return status;
  }
};

export default function AmbulanceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAmbulances = mockAmbulances.filter(ambulance => {
    const matchesSearch = ambulance.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambulance.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambulance.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ambulance.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-rioja-blue">Gestión de Ambulancias</h1>
            <p className="text-gray-600 mt-1">Administra el parque de vehículos de emergencia</p>
          </div>
          <Button className="bg-rioja-green hover:bg-rioja-green/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Ambulancia
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockAmbulances.filter(a => a.status === 'available').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Ambulance className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">En Servicio</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {mockAmbulances.filter(a => a.status === 'busy').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Wrench className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mantenimiento</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockAmbulances.filter(a => a.status === 'maintenance').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-blue-600">{mockAmbulances.length}</p>
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
              placeholder="Buscar por ID, matrícula o modelo..."
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
            <option value="available">Disponible</option>
            <option value="busy">Ocupada</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="offline">Fuera de servicio</option>
          </select>
        </div>

        {/* Ambulances Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAmbulances.map((ambulance) => (
            <Card key={ambulance.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-rioja-blue">{ambulance.vehicleId}</CardTitle>
                    <CardDescription>{ambulance.model}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(ambulance.status)}>
                    {getStatusText(ambulance.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Matrícula</p>
                    <p className="font-semibold">{ambulance.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tipo</p>
                    <p className="font-semibold">{ambulance.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{ambulance.currentLocation}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Combustible</span>
                      <span>{ambulance.fuelLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          ambulance.fuelLevel > 70 ? 'bg-green-500' :
                          ambulance.fuelLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${ambulance.fuelLevel}%` }}
                      />
                    </div>
                  </div>
                </div>

                {ambulance.driver && (
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">Conductor:</span> {ambulance.driver}</p>
                    {ambulance.medic && (
                      <p><span className="text-gray-600">Médico:</span> {ambulance.medic}</p>
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-1" />
                    Configurar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    Ubicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAmbulances.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Ambulance className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron ambulancias que coincidan con los criterios de búsqueda.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
