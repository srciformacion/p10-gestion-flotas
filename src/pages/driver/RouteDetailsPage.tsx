
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, User, Navigation, Phone } from "lucide-react";
import { ParadaCard } from "@/components/driver/ParadaCard";

interface Service {
  id: string;
  orderNumber: number;
  patientName: string;
  origin: string;
  destination: string;
  scheduledTime: string;
  estimatedPickup: string;
  estimatedArrival: string;
  transportType: 'stretcher' | 'wheelchair' | 'walking';
  observations: string;
  status: 'pending' | 'en_route_pickup' | 'picked_up' | 'en_route_destination' | 'delivered' | 'cancelled';
  contactPhone?: string;
}

interface RouteDetails {
  batchId: string;
  batchName: string;
  services: Service[];
  currentServiceIndex: number;
  totalProgress: number;
}

const RouteDetailsPage = () => {
  const { loteId } = useParams();
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setRouteDetails({
      batchId: loteId || '',
      batchName: 'Ruta Hospitales Centro',
      currentServiceIndex: 3,
      totalProgress: 37,
      services: [
        {
          id: 'srv-001',
          orderNumber: 1,
          patientName: 'María García López',
          origin: 'Hospital Clínico San Carlos, Planta 3ª',
          destination: 'Hospital La Paz, Urgencias',
          scheduledTime: '09:00',
          estimatedPickup: '09:00',
          estimatedArrival: '09:25',
          transportType: 'stretcher',
          observations: 'Paciente con movilidad reducida. Necesita oxígeno portátil.',
          status: 'delivered',
          contactPhone: '+34 666 123 456'
        },
        {
          id: 'srv-002',
          orderNumber: 2,
          patientName: 'Juan Martínez Ruiz',
          origin: 'Centro de Salud Arganzuela',
          destination: 'Hospital Gregorio Marañón, Consultas',
          scheduledTime: '09:45',
          estimatedPickup: '09:45',
          estimatedArrival: '10:10',
          transportType: 'wheelchair',
          observations: 'Cita de revisión cardiológica.',
          status: 'delivered'
        },
        {
          id: 'srv-003',
          orderNumber: 3,
          patientName: 'Ana Rodríguez Pérez',
          origin: 'Hospital La Paz, Planta 2ª',
          destination: 'Domicilio - Calle Mayor 15, 3º B',
          scheduledTime: '10:30',
          estimatedPickup: '10:30',
          estimatedArrival: '10:55',
          transportType: 'walking',
          observations: 'Alta médica. Paciente puede caminar con ayuda.',
          status: 'delivered'
        },
        {
          id: 'srv-004',
          orderNumber: 4,
          patientName: 'Carlos López Fernández',
          origin: 'Domicilio - Avenida de América 45',
          destination: 'Hospital Ramón y Cajal, Urgencias',
          scheduledTime: '11:15',
          estimatedPickup: '11:15',
          estimatedArrival: '11:40',
          transportType: 'stretcher',
          observations: 'Urgencia médica. Paciente con dolor abdominal severo.',
          status: 'en_route_destination',
          contactPhone: '+34 666 789 123'
        },
        {
          id: 'srv-005',
          orderNumber: 5,
          patientName: 'Isabel Gómez Torres',
          origin: 'Hospital Gregorio Marañón, Planta 5ª',
          destination: 'Centro de Rehabilitación San Juan',
          scheduledTime: '12:00',
          estimatedPickup: '12:00',
          estimatedArrival: '12:20',
          transportType: 'wheelchair',
          observations: 'Sesión de fisioterapia programada.',
          status: 'pending'
        },
        {
          id: 'srv-006',
          orderNumber: 6,
          patientName: 'Miguel Sánchez Díaz',
          origin: 'Centro de Salud Retiro',
          destination: 'Hospital Clínico San Carlos, Oncología',
          scheduledTime: '12:45',
          estimatedPickup: '12:45',
          estimatedArrival: '13:10',
          transportType: 'walking',
          observations: 'Tratamiento de quimioterapia.',
          status: 'pending'
        },
        {
          id: 'srv-007',
          orderNumber: 7,
          patientName: 'Carmen Ruiz Moreno',
          origin: 'Hospital La Paz, Urgencias',
          destination: 'Domicilio - Plaza de España 8, 1º A',
          scheduledTime: '13:30',
          estimatedPickup: '13:30',
          estimatedArrival: '13:55',
          transportType: 'wheelchair',
          observations: 'Alta de urgencias. Paciente estable.',
          status: 'pending'
        },
        {
          id: 'srv-008',
          orderNumber: 8,
          patientName: 'Francisco Torres Gil',
          origin: 'Domicilio - Calle Alcalá 123, 2º C',
          destination: 'Hospital Ramón y Cajal, Cardiología',
          scheduledTime: '14:15',
          estimatedPickup: '14:15',
          estimatedArrival: '14:45',
          transportType: 'stretcher',
          observations: 'Revisión post-operatoria. Paciente con marcapasos.',
          status: 'pending',
          contactPhone: '+34 666 456 789'
        }
      ]
    });
  }, [loteId]);

  const updateServiceStatus = (serviceId: string, newStatus: Service['status']) => {
    if (!routeDetails) return;

    const updatedServices = routeDetails.services.map(service =>
      service.id === serviceId ? { ...service, status: newStatus } : service
    );

    // Calculate new progress
    const completedServices = updatedServices.filter(s => s.status === 'delivered').length;
    const totalProgress = Math.round((completedServices / updatedServices.length) * 100);

    // Find current active service index
    let currentServiceIndex = updatedServices.findIndex(s => 
      s.status !== 'delivered' && s.status !== 'cancelled'
    );
    if (currentServiceIndex === -1) currentServiceIndex = updatedServices.length;

    setRouteDetails({
      ...routeDetails,
      services: updatedServices,
      currentServiceIndex,
      totalProgress
    });
  };

  if (!routeDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando detalles de la ruta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/driver/batch-view/${routeDetails.batchId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Lote
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Detalles de la Ruta</h1>
            <p className="text-muted-foreground">{routeDetails.batchName}</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Progreso General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {routeDetails.services.filter(s => s.status === 'delivered').length}
                </div>
                <div className="text-sm text-muted-foreground">Completados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {routeDetails.services.filter(s => s.status !== 'delivered' && s.status !== 'cancelled').length}
                </div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {routeDetails.totalProgress}%
                </div>
                <div className="text-sm text-muted-foreground">Progreso</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${routeDetails.totalProgress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Paradas del Día</h2>
        {routeDetails.services.map((service, index) => (
          <ParadaCard
            key={service.id}
            service={service}
            isActive={index === routeDetails.currentServiceIndex}
            onUpdateStatus={updateServiceStatus}
          />
        ))}
      </div>

      {/* Emergency Contact */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-700">
            <Phone className="h-5 w-5" />
            <span className="font-medium">Contacto de Emergencia</span>
          </div>
          <p className="text-sm text-red-600 mt-2">
            En caso de emergencia o incidencia, contacta inmediatamente con el Centro Coordinador: 
            <span className="font-bold"> 112</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteDetailsPage;
