
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, MapPin, Clock, Calendar } from "lucide-react";
import { TransportRequest } from "@/types";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const alertVariants = cva("mb-4", {
  variants: {
    status: {
      pending: "border-2 border-status-pending bg-orange-50 text-status-pending",
      assigned: "border-2 border-status-assigned bg-blue-50 text-status-assigned",
      inRoute: "border-2 border-status-inRoute bg-purple-50 text-status-inRoute",
      completed: "border-2 border-status-completed bg-green-50 text-status-completed",
      cancelled: "border-2 border-status-cancelled bg-red-50 text-status-cancelled",
    },
  },
  defaultVariants: {
    status: "pending",
  },
});

interface StatusNotificationProps {
  request: TransportRequest;
  show: boolean;
  onClose: () => void;
}

export const StatusNotification = ({ request, show, onClose }: StatusNotificationProps) => {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  
  // Actualizar la cuenta atrás para la llegada estimada
  useEffect(() => {
    if (!request.estimatedArrival || request.status !== 'assigned' && request.status !== 'inRoute') {
      setTimeRemaining(null);
      return;
    }
    
    const updateRemainingTime = () => {
      const now = new Date();
      const eta = new Date(request.estimatedArrival as string);
      
      if (now > eta) {
        setTimeRemaining("Llegada inminente");
        return;
      }
      
      try {
        const timeStr = formatDistanceToNow(eta, { locale: es, addSuffix: true });
        setTimeRemaining(timeStr);
      } catch (error) {
        setTimeRemaining(format(eta, "HH:mm"));
      }
    };
    
    // Actualizar inmediatamente
    updateRemainingTime();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(updateRemainingTime, 30000);
    return () => clearInterval(interval);
  }, [request.estimatedArrival, request.status]);

  if (!show) return null;

  const statusInfo = {
    pending: {
      title: "Solicitud en espera",
      description: "La solicitud está pendiente de asignación",
      icon: Clock,
    },
    assigned: {
      title: "Vehículo asignado",
      description: `Se ha asignado un vehículo (${request.assignedVehicle || "Sin especificar"})`,
      icon: Calendar,
    },
    inRoute: {
      title: "En camino",
      description: "El vehículo está en camino",
      icon: MapPin,
    },
    completed: {
      title: "Servicio completado",
      description: "El servicio ha sido completado exitosamente",
      icon: CheckCircle,
    },
    cancelled: {
      title: "Servicio cancelado",
      description: "El servicio ha sido cancelado",
      icon: AlertTriangle,
    },
  };

  const { title, description, icon: Icon } = statusInfo[request.status];

  return (
    <Alert className={alertVariants({ status: request.status })}>
      <Icon className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        {title}
        {timeRemaining && (
          <span className="font-normal text-sm flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeRemaining}
          </span>
        )}
      </AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
