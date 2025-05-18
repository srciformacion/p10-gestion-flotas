
import React, { useMemo } from "react";
import { RequestStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Calendar 
} from "lucide-react";

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

export const RequestStatusBadge = React.memo(({ status }: RequestStatusBadgeProps) => {
  const statusInfo = useMemo(() => ({
    pending: {
      label: 'Pendiente',
      icon: Clock,
      className: 'bg-status-pending text-neutral-800' // Amarillo con texto oscuro
    },
    assigned: {
      label: 'Asignada',
      icon: Calendar,
      className: 'bg-status-assigned text-white' // Verde primario con texto blanco
    },
    inRoute: {
      label: 'En camino',
      icon: MapPin,
      className: 'bg-status-inRoute text-white' // Verde primario con texto blanco
    },
    completed: {
      label: 'Completada',
      icon: CheckCircle,
      className: 'bg-status-completed text-white' // Verde oscuro con texto blanco
    },
    cancelled: {
      label: 'Cancelada',
      icon: AlertTriangle,
      className: 'bg-status-cancelled text-white' // Rojo con texto blanco
    }
  }), []);

  // Asegurarse de que status siempre sea una clave válida, por si acaso.
  const currentStatusInfo = statusInfo[status] || statusInfo.pending;
  const { label, className, icon: Icon } = currentStatusInfo;

  return (
    <Badge className={`flex items-center gap-1.5 font-medium ${className} px-3 py-1 border-transparent`} variant="outline">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
});

RequestStatusBadge.displayName = "RequestStatusBadge";
