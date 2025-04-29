
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Info, Clock } from "lucide-react";
import { TransportRequest } from "@/types";
import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const alertVariants = cva("mb-4", {
  variants: {
    status: {
      pending: "border-blue-500 text-blue-500",
      assigned: "border-amber-500 text-amber-500",
      inRoute: "border-purple-500 text-purple-500",
      completed: "border-green-500 text-green-500",
      cancelled: "border-red-500 text-red-500",
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
      icon: Info,
    },
    assigned: {
      title: "Vehículo asignado",
      description: `Se ha asignado un vehículo (${request.assignedVehicle || "Sin especificar"})`,
      icon: Info,
    },
    inRoute: {
      title: "En camino",
      description: "El vehículo está en camino",
      icon: Info,
    },
    completed: {
      title: "Servicio completado",
      description: "El servicio ha sido completado exitosamente",
      icon: CheckCircle,
    },
    cancelled: {
      title: "Servicio cancelado",
      description: "El servicio ha sido cancelado",
      icon: AlertCircle,
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
