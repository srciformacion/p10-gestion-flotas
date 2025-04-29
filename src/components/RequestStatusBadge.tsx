
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
      variant: 'warning',
      icon: Clock,
      className: 'bg-status-pending text-white'
    },
    assigned: {
      label: 'Asignada',
      variant: 'info',
      icon: Calendar,
      className: 'bg-status-assigned text-white'
    },
    inRoute: {
      label: 'En camino',
      variant: 'primary',
      icon: MapPin,
      className: 'bg-status-inRoute text-white'
    },
    completed: {
      label: 'Completada',
      variant: 'success',
      icon: CheckCircle,
      className: 'bg-status-completed text-white'
    },
    cancelled: {
      label: 'Cancelada',
      variant: 'destructive',
      icon: AlertTriangle,
      className: 'bg-status-cancelled text-white'
    }
  }), []);

  const { label, className, icon: Icon } = statusInfo[status];

  return (
    <Badge className={`flex items-center gap-1.5 font-medium ${className} px-3 py-1`} variant="outline">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
});

RequestStatusBadge.displayName = "RequestStatusBadge";
