
import { User } from "@/types";
import { TransportRequest } from "@/types";
import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ambulance, Calendar, FileCheck, UserCheck } from "lucide-react";

interface DashboardCardsProps {
  user: User;
  requests: TransportRequest[];
}

export const DashboardCards = ({ user, requests }: DashboardCardsProps) => {
  // Calculate request stats
  const pendingRequestsCount = requests.filter(req => req.status === 'pending').length;
  const assignedRequestsCount = requests.filter(req => req.status === 'assigned').length;
  const inProgressRequestsCount = requests.filter(req => req.status === 'inRoute').length;
  const completedRequestsCount = requests.filter(req => req.status === 'completed').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatsCard 
        title="Solicitudes Pendientes" 
        value={pendingRequestsCount} 
        description="En espera de asignación"
        icon={Calendar}
        className="bg-white border-l-4 border-status-pending"
      />
      
      <StatsCard 
        title="Asignadas" 
        value={assignedRequestsCount} 
        description="Vehículos asignados"
        icon={Ambulance}
        className="bg-white border-l-4 border-status-assigned"
      />
      
      <StatsCard 
        title="En Ruta" 
        value={inProgressRequestsCount} 
        description="Traslados en curso"
        icon={FileCheck}
        className="bg-white border-l-4 border-status-inRoute"
      />
      
      <StatsCard 
        title="Completadas" 
        value={completedRequestsCount} 
        description="Traslados finalizados"
        icon={UserCheck}
        className="bg-white border-l-4 border-status-completed"
      />
      
      <div className="md:col-span-2">
        <QuickActions user={user} pendingRequestsCount={pendingRequestsCount} />
      </div>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Actividad reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {requests.length > 0 
              ? "Consulta tus solicitudes recientes abajo" 
              : "No hay actividad reciente para mostrar"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
