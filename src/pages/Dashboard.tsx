import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Ambulance, Clock } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RequestsList } from "@/components/dashboard/RequestsList";
import { DashboardActions } from "@/components/dashboard/DashboardActions";

const Dashboard = () => {
  const { user } = useAuth();
  const { requests } = useRequests();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'individual') {
      navigate('/solicitudes');
    }
  }, [user, navigate]);

  if (!user || user.role === 'individual') return null;

  const pendingRequestsCount = requests.filter(req => req.status === 'pending').length;
  const assignedRequestsCount = requests.filter(req => req.status === 'assigned').length;
  const inRouteRequestsCount = requests.filter(req => req.status === 'inRoute').length;
  const completedRequestsCount = requests.filter(req => req.status === 'completed').length;
  
  const totalRequestsCount = requests.length;
  
  const userRequests = user.role === 'hospital'
    ? requests.filter(req => req.createdBy === user.id).slice(0, 5)
    : requests.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Bienvenido, {user.name}
          </h1>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
            <DashboardActions user={user} />
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="requests">Solicitudes</TabsTrigger>
              {user.role === 'admin' && <TabsTrigger value="admin">Administración</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
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
                <RecentRequests requests={userRequests} />
                <QuickActions user={user} pendingRequestsCount={pendingRequestsCount} />
              </div>
            </TabsContent>
            
            <TabsContent value="requests">
              <RequestsList 
                requests={requests}
                totalCount={totalRequestsCount}
                user={user}
              />
            </TabsContent>
            
            {user.role === 'admin' && (
              <TabsContent value="admin">
                <QuickActions user={user} pendingRequestsCount={pendingRequestsCount} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
