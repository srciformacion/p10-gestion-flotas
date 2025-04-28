
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { TransportRequest } from "@/types";
import { cva } from "class-variance-authority";

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
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
