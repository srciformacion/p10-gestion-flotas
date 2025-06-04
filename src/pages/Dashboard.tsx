
import { memo, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsProvider";
import { RequireAuth } from "@/components/RequireAuth";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import DriverDashboard from "./driver/DriverDashboard";

const Dashboard = memo(() => {
  const { user } = useAuth();
  const { requests, isLoading } = useRequests();

  // If user is ambulance role, show driver dashboard
  if (user?.role === 'ambulance') {
    return (
      <RequireAuth allowedRoles={['ambulance']}>
        <Suspense fallback={<LoadingSpinner text="Cargando dashboard del conductor..." />}>
          <DriverDashboard />
        </Suspense>
      </RequireAuth>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Cargando dashboard..." />
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-sm text-muted-foreground">
            Bienvenido, {user?.name}
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner text="Cargando estadísticas..." />}>
          <DashboardStats requests={requests} />
        </Suspense>

        <Suspense fallback={<LoadingSpinner text="Cargando contenido..." />}>
          <DashboardContent user={user!} requests={requests} />
        </Suspense>
      </div>
    </RequireAuth>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
