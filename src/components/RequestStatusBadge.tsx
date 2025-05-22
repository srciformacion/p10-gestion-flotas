
import { RequestStatus } from "@/types";

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const statusInfo = {
    pending: {
      label: 'Pendiente',
      className: 'status-pending'
    },
    assigned: {
      label: 'Asignada',
      className: 'status-assigned'
    },
    inRoute: {
      label: 'En camino',
      className: 'status-inRoute'
    },
    completed: {
      label: 'Completada',
      className: 'status-completed'
    },
    cancelled: {
      label: 'Cancelada',
      className: 'status-cancelled'
    }
  };

  const { label, className } = statusInfo[status];

  return (
    <span className={`status-badge ${className}`}>
      {label}
    </span>
  );
}
