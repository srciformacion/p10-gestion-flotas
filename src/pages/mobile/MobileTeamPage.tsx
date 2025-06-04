
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  MapPin, 
  Clock, 
  Route, 
  CheckCircle, 
  AlertCircle,
  Navigation,
  Phone,
  MessageSquare,
  Camera,
  FileText,
  Play,
  Pause,
  Flag
} from 'lucide-react';

interface MobileAssignment {
  id: string;
  requestId: string;
  patientName: string;
  type: 'pickup' | 'delivery' | 'emergency';
  status: 'pending' | 'en_route' | 'arrived' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  origin: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  estimatedTime: number;
  distance: number;
  contactPerson: string;
  contactPhone: string;
  specialInstructions?: string;
  equipmentRequired: string[];
  startTime?: string;
  estimatedArrival?: string;
}

const mockAssignments: MobileAssignment[] = [
  {
    id: '1',
    requestId: 'REQ-2024-001',
    patientName: 'Juan Pérez',
    type: 'pickup',
    status: 'en_route',
    priority: 'high',
    origin: {
      address: 'Calle Mayor, 15, Madrid',
      coordinates: { lat: 40.4168, lng: -3.7038 }
    },
    destination: {
      address: 'Hospital General, Madrid',
      coordinates: { lat: 40.4000, lng: -3.6800 }
    },
    estimatedTime: 15,
    distance: 8.5,
    contactPerson: 'María Pérez',
    contactPhone: '+34 600 123 456',
    specialInstructions: 'Paciente con movilidad reducida, requiere camilla',
    equipmentRequired: ['Camilla', 'Oxígeno portátil'],
    startTime: '10:30',
    estimatedArrival: '10:45'
  },
  {
    id: '2',
    requestId: 'REQ-2024-002',
    patientName: 'Ana González',
    type: 'delivery',
    status: 'pending',
    priority: 'medium',
    origin: {
      address: 'Hospital Regional, Madrid',
      coordinates: { lat: 40.4200, lng: -3.6900 }
    },
    destination: {
      address: 'Centro de Rehabilitación, Madrid',
      coordinates: { lat: 40.4100, lng: -3.6950 }
    },
    estimatedTime: 20,
    distance: 12.3,
    contactPerson: 'Dr. Rodríguez',
    contactPhone: '+34 600 789 012',
    equipmentRequired: ['Silla de ruedas'],
    estimatedArrival: '11:30'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'en_route': return 'bg-blue-100 text-blue-800';
    case 'arrived': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'en_route': return 'En Ruta';
    case 'arrived': return 'En Destino';
    case 'completed': return 'Completado';
    default: return status;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'emergency': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'pickup': return 'bg-blue-100 text-blue-800';
    case 'delivery': return 'bg-green-100 text-green-800';
    case 'emergency': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTypeText = (type: string) => {
  switch (type) {
    case 'pickup': return 'Recogida';
    case 'delivery': return 'Entrega';
    case 'emergency': return 'Emergencia';
    default: return type;
  }
};

export default function MobileTeamPage() {
  const [activeAssignment, setActiveAssignment] = useState<string | null>(mockAssignments[0]?.id || null);
  const [currentStatus, setCurrentStatus] = useState('available');

  const currentAssignment = mockAssignments.find(a => a.id === activeAssignment);

  const handleStatusUpdate = (assignmentId: string, newStatus: string) => {
    console.log(`Updating assignment ${assignmentId} to status ${newStatus}`);
    // Aquí iría la lógica para actualizar el estado
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-rioja-blue">Equipo Móvil</h1>
            <p className="text-gray-600 mt-1">Dashboard para personal de campo</p>
          </div>
          <div className="flex gap-2">
            <Badge 
              className={currentStatus === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
            >
              {currentStatus === 'available' ? 'Disponible' : 'Ocupado'}
            </Badge>
            <Button 
              variant={currentStatus === 'available' ? "outline" : "default"}
              onClick={() => setCurrentStatus(currentStatus === 'available' ? 'busy' : 'available')}
              className={currentStatus === 'busy' ? "bg-rioja-green hover:bg-rioja-green/90" : ""}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              {currentStatus === 'available' ? 'Marcar Ocupado' : 'Marcar Disponible'}
            </Button>
          </div>
        </div>

        {/* Current Assignment */}
        {currentAssignment && (
          <Card className="border-l-4 border-l-rioja-green">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-rioja-blue flex items-center gap-2">
                    Asignación Activa
                    <Badge className={getStatusColor(currentAssignment.status)}>
                      {getStatusText(currentAssignment.status)}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {currentAssignment.patientName} • {currentAssignment.requestId}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Badge className={getPriorityColor(currentAssignment.priority)}>
                    {currentAssignment.priority.toUpperCase()}
                  </Badge>
                  <Badge className={getTypeColor(currentAssignment.type)}>
                    {getTypeText(currentAssignment.type)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-700 flex items-center gap-2 mb-1">
                      <Flag className="w-4 h-4" />
                      Origen
                    </h4>
                    <p className="text-sm">{currentAssignment.origin.address}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700 flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4" />
                      Destino
                    </h4>
                    <p className="text-sm">{currentAssignment.destination.address}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tiempo Estimado</p>
                      <p className="font-semibold">{currentAssignment.estimatedTime} min</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Distancia</p>
                      <p className="font-semibold">{currentAssignment.distance} km</p>
                    </div>
                  </div>
                  {currentAssignment.estimatedArrival && (
                    <div>
                      <p className="text-sm text-gray-600">ETA</p>
                      <p className="font-semibold">{currentAssignment.estimatedArrival}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Información de Contacto</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-blue-700">Persona responsable</p>
                    <p className="font-medium text-blue-900">{currentAssignment.contactPerson}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {currentAssignment.contactPhone}
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {currentAssignment.specialInstructions && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-1">Instrucciones Especiales</h4>
                  <p className="text-sm text-yellow-800">{currentAssignment.specialInstructions}</p>
                </div>
              )}

              {/* Equipment Required */}
              {currentAssignment.equipmentRequired.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Equipamiento Requerido</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentAssignment.equipmentRequired.map((equipment, index) => (
                      <Badge key={index} variant="outline">
                        {equipment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusUpdate(currentAssignment.id, 'en_route')}
                  disabled={currentAssignment.status !== 'pending'}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Iniciar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleStatusUpdate(currentAssignment.id, 'arrived')}
                  disabled={currentAssignment.status !== 'en_route'}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Llegué
                </Button>
                <Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-1" />
                  Navegar
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-1" />
                  Foto
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Assignments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-rioja-blue">Todas las Asignaciones</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockAssignments.map((assignment) => (
              <Card 
                key={assignment.id} 
                className={`hover:shadow-lg transition-shadow cursor-pointer ${
                  assignment.id === activeAssignment ? 'ring-2 ring-rioja-green' : ''
                }`}
                onClick={() => setActiveAssignment(assignment.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{assignment.patientName}</CardTitle>
                      <CardDescription>{assignment.requestId}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={getStatusColor(assignment.status)}>
                        {getStatusText(assignment.status)}
                      </Badge>
                      <Badge className={getTypeColor(assignment.type)}>
                        {getTypeText(assignment.type)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-green-600" />
                      <span className="truncate">{assignment.origin.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-600" />
                      <span className="truncate">{assignment.destination.address}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{assignment.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Route className="w-4 h-4 text-gray-500" />
                      <span>{assignment.distance} km</span>
                    </div>
                  </div>

                  {assignment.estimatedArrival && (
                    <div className="text-sm bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">ETA: </span>
                      <span className="font-medium">{assignment.estimatedArrival}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="flex flex-col gap-2 h-16">
                <FileText className="w-5 h-5" />
                <span className="text-sm">Reportar</span>
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-16">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">Mensajes</span>
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-16">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Incidencia</span>
              </Button>
              <Button variant="outline" className="flex flex-col gap-2 h-16">
                <Phone className="w-5 h-5" />
                <span className="text-sm">Emergencia</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
