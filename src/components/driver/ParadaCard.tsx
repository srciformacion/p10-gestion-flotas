
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, User, Navigation, Phone, CheckCircle, AlertTriangle } from "lucide-react";

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

interface ParadaCardProps {
  service: Service;
  isActive: boolean;
  onUpdateStatus: (serviceId: string, newStatus: Service['status']) => void;
}

export const ParadaCard = ({ service, isActive, onUpdateStatus }: ParadaCardProps) => {
  const getStatusConfig = (status: Service['status']) => {
    const configs = {
      pending: { label: 'Pendiente', className: 'bg-yellow-500', icon: Clock },
      en_route_pickup: { label: 'En ruta a recogida', className: 'bg-blue-500', icon: Navigation },
      picked_up: { label: 'Paciente recogido', className: 'bg-orange-500', icon: User },
      en_route_destination: { label: 'En ruta al destino', className: 'bg-purple-500', icon: Navigation },
      delivered: { label: 'Completado', className: 'bg-green-500', icon: CheckCircle },
      cancelled: { label: 'Cancelado', className: 'bg-red-500', icon: AlertTriangle }
    };
    return configs[status];
  };

  const getTransportTypeLabel = (type: Service['transportType']) => {
    const types = {
      stretcher: 'Camilla',
      wheelchair: 'Silla de ruedas',
      walking: 'Andando'
    };
    return types[type];
  };

  const getActionButtons = () => {
    switch (service.status) {
      case 'pending':
        return (
          <Button 
            onClick={() => onUpdateStatus(service.id, 'en_route_pickup')}
            className="w-full"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Iniciar Ruta a Recogida
          </Button>
        );
      case 'en_route_pickup':
        return (
          <div className="space-y-2">
            <Button 
              onClick={() => onUpdateStatus(service.id, 'picked_up')}
              className="w-full"
            >
              <User className="h-4 w-4 mr-2" />
              Paciente Recogido
            </Button>
            <Button 
              onClick={() => onUpdateStatus(service.id, 'cancelled')}
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              No Presentado
            </Button>
          </div>
        );
      case 'picked_up':
        return (
          <Button 
            onClick={() => onUpdateStatus(service.id, 'en_route_destination')}
            className="w-full"
          >
            <Navigation className="h-4 w-4 mr-2" />
            En Ruta al Destino
          </Button>
        );
      case 'en_route_destination':
        return (
          <Button 
            onClick={() => onUpdateStatus(service.id, 'delivered')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Finalizar Servicio
          </Button>
        );
      default:
        return null;
    }
  };

  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/${encodedAddress}`, '_blank');
  };

  const statusConfig = getStatusConfig(service.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={`${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''} ${service.status === 'delivered' ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              {service.orderNumber}
            </div>
            <span className="text-lg">{service.patientName}</span>
          </CardTitle>
          <Badge className={statusConfig.className}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Service Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Origen</p>
            <div className="flex items-center justify-between">
              <p className="text-sm">{service.origin}</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => openInMaps(service.origin)}
              >
                <MapPin className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Destino</p>
            <div className="flex items-center justify-between">
              <p className="text-sm">{service.destination}</p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => openInMaps(service.destination)}
              >
                <MapPin className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Hora Cita</p>
            <p className="text-sm font-bold">{service.scheduledTime}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Recogida Est.</p>
            <p className="text-sm">{service.estimatedPickup}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Llegada Est.</p>
            <p className="text-sm">{service.estimatedArrival}</p>
          </div>
        </div>

        {/* Transport Type */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">Medio de Transporte</p>
          <Badge variant="outline" className="mt-1">
            {getTransportTypeLabel(service.transportType)}
          </Badge>
        </div>

        {/* Observations */}
        {service.observations && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
            <p className="text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
              {service.observations}
            </p>
          </div>
        )}

        {/* Contact Phone */}
        {service.contactPhone && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Teléfono de Contacto</p>
            <div className="flex items-center gap-2">
              <span className="text-sm">{service.contactPhone}</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open(`tel:${service.contactPhone}`, '_self')}
              >
                <Phone className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isActive && service.status !== 'delivered' && service.status !== 'cancelled' && (
          <div className="pt-2 border-t">
            {getActionButtons()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
