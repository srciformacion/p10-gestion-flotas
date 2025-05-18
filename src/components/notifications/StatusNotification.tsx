import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, MapPin, Clock, Calendar } from "lucide-react";
import { TransportRequest } from "@/types";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const alertVariants = cva("mb-4 border-2", { // 'border-2' se aplica a todos
  variants: {
    status: {
      pending: "border-status-pending bg-status-pending/10 text-status-pending", // Amarillo
      assigned: "border-status-assigned bg-status-assigned/10 text-status-assigned", // Verde primario
      inRoute: "border-status-inRoute bg-status-inRoute/10 text-status-inRoute", // Verde primario
      completed: "border-status-completed bg-status-completed/10 text-status-completed", // Verde oscuro
      cancelled: "border-status-cancelled bg-status-cancelled/10 text-status-cancelled", // Rojo
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
    if (!request.estimatedArrival || (request.status !== 'assigned' && request.status !== 'inRoute')) {
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
        // Fallback if date-fns throws an error with the date format
        setTimeRemaining(format(eta, "HH:mm"));
      }
    };
    
    updateRemainingTime();
    
    const interval = setInterval(updateRemainingTime, 30000); // Actualizar cada 30 segundos
    return () => clearInterval(interval);
  }, [request.estimatedArrival, request.status]);

  if (!show) return null;

  const statusInfo = {
    pending: {
      title: "Solicitud en espera",
      description: "La solicitud está pendiente de asignación",
      icon: Clock,
      iconClass: "text-status-pending", // Icono tomará el color del texto del alert
    },
    assigned: {
      title: "Vehículo asignado",
      description: `Se ha asignado un vehículo (${request.assignedVehicle || "Sin especificar"})`,
      icon: Calendar,
      iconClass: "text-status-assigned",
    },
    inRoute: {
      title: "En camino",
      description: "El vehículo está en camino",
      icon: MapPin,
      iconClass: "text-status-inRoute",
    },
    completed: {
      title: "Servicio completado",
      description: "El servicio ha sido completado exitosamente",
      icon: CheckCircle,
      iconClass: "text-status-completed",
    },
    cancelled: {
      title: "Servicio cancelado",
      description: "El servicio ha sido cancelado",
      icon: AlertTriangle,
      iconClass: "text-status-cancelled",
    },
  };

  const currentStatusInfo = statusInfo[request.status] || statusInfo.pending;
  const { title, description, icon: Icon, iconClass } = currentStatusInfo;

  return (
    <Alert className={alertVariants({ status: request.status })}>
      <Icon className={`h-4 w-4 ${iconClass}`} />
      <AlertTitle className="flex items-center gap-2">
        {title}
        {timeRemaining && request.status !== 'completed' && request.status !== 'cancelled' && (
          <span className="font-normal text-sm flex items-center gap-1">
            <Clock className="h-3 w-3" /> {timeRemaining}
          </span>
        )}
      </AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
