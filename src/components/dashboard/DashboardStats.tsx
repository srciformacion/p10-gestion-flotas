
import { memo } from 'react';
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { TransportRequest } from "@/types/request";

interface DashboardStatsProps {
  requests: TransportRequest[];
}

export const DashboardStats = memo(({ requests }: DashboardStatsProps) => {
  const pendingCount = requests.filter(req => req.status === 'pending').length;
  const assignedCount = requests.filter(req => req.status === 'assigned').length;
  const completedCount = requests.filter(req => req.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Solicitudes Pendientes"
        value={pendingCount}
        description="Esperando asignación"
        icon={Clock}
        iconClassName="text-yellow-500"
      />
      <StatsCard
        title="En Proceso"
        value={assignedCount}
        description="Asignadas y en ruta"
        icon={AlertCircle}
        iconClassName="text-blue-500"
      />
      <StatsCard
        title="Completadas"
        value={completedCount}
        description="Finalizadas correctamente"
        icon={CheckCircle}
        iconClassName="text-green-500"
      />
    </div>
  );
});

DashboardStats.displayName = 'DashboardStats';
