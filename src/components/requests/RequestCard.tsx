
import { TransportRequest } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestStatusBadge } from "@/components/RequestStatusBadge";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";

interface RequestCardProps {
  request: TransportRequest;
}

export const RequestCard = ({ request }: RequestCardProps) => {
  const navigate = useNavigate();

  const showTrackingButton = 
    request.status === 'assigned' || 
    request.status === 'inRoute';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{request.patientName}</h3>
              <RequestStatusBadge status={request.status} />
            </div>
            <p className="text-sm text-gray-500 mt-1">ID: {request.patientId}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm"><span className="font-medium">Origen:</span> {request.origin}</p>
              <p className="text-sm"><span className="font-medium">Destino:</span> {request.destination}</p>
              <p className="text-sm">
                <span className="font-medium">Fecha:</span>{" "}
                {new Date(request.dateTime).toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm mb-1">
                <span className="font-medium">Tipo:</span> {
                  request.transportType === 'stretcher' ? 'Camilla' : 
                  request.transportType === 'wheelchair' ? 'Silla de ruedas' : 'Andando'
                }
              </p>
              {request.assignedVehicle && (
                <p className="text-sm"><span className="font-medium">Vehículo:</span> {request.assignedVehicle}</p>
              )}
              {request.estimatedArrival && (
                <p className="text-sm"><span className="font-medium">ETA:</span> {
                  new Date(request.estimatedArrival).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }</p>
              )}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 justify-end">
              {showTrackingButton && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => navigate(`/seguimiento/${request.id}`)}
                  className="gap-1"
                >
                  <MapPin className="h-4 w-4" /> 
                  Seguir ambulancia
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/solicitudes/${request.id}`)}
              >
                Ver detalles
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
