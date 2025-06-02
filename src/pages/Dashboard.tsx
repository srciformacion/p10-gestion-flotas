
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { RequireAuth } from "@/components/RequireAuth";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import DriverDashboard from "./driver/DriverDashboard";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { requests } = useRequests();

  // If user is ambulance role, show driver dashboard
  if (user?.role === 'ambulance') {
    return (
      <RequireAuth allowedRoles={['ambulance']}>
        <DriverDashboard />
      </RequireAuth>
    );
  }

  // For other roles, show the regular dashboard
  const pendingRequests = requests.filter(req => req.status === 'pending');
  const assignedRequests = requests.filter(req => req.status === 'assigned');
  const completedRequests = requests.filter(req => req.status === 'completed');

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Bienvenido, {user?.name}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Solicitudes Pendientes"
            value={pendingRequests.length}
            description="Esperando asignación"
            icon={Clock}
            iconClassName="text-yellow-500"
          />
          <StatsCard
            title="En Proceso"
            value={assignedRequests.length}
            description="Asignadas y en ruta"
            icon={AlertCircle}
            iconClassName="text-blue-500"
          />
          <StatsCard
            title="Completadas"
            value={completedRequests.length}
            description="Finalizadas correctamente"
            icon={CheckCircle}
            iconClassName="text-green-500"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <DashboardActions 
            user={user!} 
          />

          {/* Recent Requests */}
          <RecentRequests requests={requests.slice(0, 5)} />
        </div>
      </div>
    </RequireAuth>
  );
};

export default Dashboard;
