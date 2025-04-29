
import { User } from "@/types";
import { Clock, Calendar, Ambulance, FileText } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { QuickActions } from "@/components/dashboard/QuickActions";

/**
 * DashboardOverviewTab component
 * 
 * Displays an overview of transport requests with their statuses and counts.
 * Shows statistics cards for different request statuses and includes recent requests
 * and quick actions for the user.
 *
 * @param pendingRequestsCount - Number of requests with 'pending' status
 * @param assignedRequestsCount - Number of requests with 'assigned' status
 * @param inRouteRequestsCount - Number of requests with 'inRoute' status
 * @param completedRequestsCount - Number of requests with 'completed' status
 * @param user - Current authenticated user object
 */
interface DashboardOverviewTabProps {
  pendingRequestsCount: number;
  assignedRequestsCount: number;
  inRouteRequestsCount: number;
  completedRequestsCount: number;
  user: User;
}

export const DashboardOverviewTab = ({
  pendingRequestsCount,
  assignedRequestsCount,
  inRouteRequestsCount,
  completedRequestsCount,
  user
}: DashboardOverviewTabProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Solicitudes Pendientes"
          value={pendingRequestsCount}
          description={`${pendingRequestsCount === 1 ? 'Solicitud por asignar' : 'Solicitudes por asignar'}`}
          icon={Clock}
          iconClassName="text-status-pending"
        />
        <StatsCard
          title="Asignadas"
          value={assignedRequestsCount}
          description={`${assignedRequestsCount === 1 ? 'Vehículo asignado' : 'Vehículos asignados'}`}
          icon={Calendar}
          iconClassName="text-status-assigned"
        />
        <StatsCard
          title="En Ruta"
          value={inRouteRequestsCount}
          description={`${inRouteRequestsCount === 1 ? 'Ambulancia en camino' : 'Ambulancias en camino'}`}
          icon={Ambulance}
          iconClassName="text-status-inRoute"
        />
        <StatsCard
          title="Completadas"
          value={completedRequestsCount}
          description={`${completedRequestsCount === 1 ? 'Servicio completado' : 'Servicios completados'}`}
          icon={FileText}
          iconClassName="text-status-completed"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RecentRequests />
        <QuickActions user={user} pendingRequestsCount={pendingRequestsCount} />
      </div>
    </>
  );
};
