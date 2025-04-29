import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/types";
import { TransportRequest } from "@/types";
import { RequestsList } from "@/components/dashboard/RequestsList";
import { Clock, Calendar, Ambulance, FileText, MapPin, Users, Settings, BarChart } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DashboardTabsProps {
  user: User;
  requests: TransportRequest[];
  totalRequestsCount: number;
}

export const DashboardTabs = ({ user, requests, totalRequestsCount }: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const pendingRequestsCount = requests.filter(req => req.status === 'pending').length;
  const assignedRequestsCount = requests.filter(req => req.status === 'assigned').length;
  const inRouteRequestsCount = requests.filter(req => req.status === 'inRoute').length;
  const completedRequestsCount = requests.filter(req => req.status === 'completed').length;
  
  // Opciones específicas para empresa de ambulancias
  const ambulanceOptions = [
    {
      title: "Gestión de Vehículos",
      description: "Administrar mi flota de ambulancias",
      icon: Ambulance,
      href: "/vehiculos",
      variant: "default" as "default" | "outline",
    },
    {
      title: "Solicitudes Activas",
      description: "Ver solicitudes asignadas a mi flota",
      icon: FileText,
      href: "/solicitudes?status=assigned",
      variant: "outline" as "default" | "outline",
    },
    {
      title: "Seguimiento GPS",
      description: "Ver la ubicación en tiempo real de mis vehículos",
      icon: MapPin,
      href: "/seguimiento",
      variant: "outline" as "default" | "outline",
    }
  ];
  
  return (
    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Resumen</TabsTrigger>
        <TabsTrigger value="requests">Solicitudes</TabsTrigger>
        {user.role === 'ambulance' && <TabsTrigger value="vehicles">Vehículos</TabsTrigger>}
        {user.role === 'admin' && <TabsTrigger value="admin">Administración</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <DashboardOverviewTab 
          pendingRequestsCount={pendingRequestsCount}
          assignedRequestsCount={assignedRequestsCount}
          inRouteRequestsCount={inRouteRequestsCount}
          completedRequestsCount={completedRequestsCount}
          user={user}
        />
      </TabsContent>
      
      <TabsContent value="requests">
        <RequestsList 
          requests={requests}
          totalCount={totalRequestsCount}
          user={user}
        />
      </TabsContent>
      
      {user.role === 'ambulance' && (
        <TabsContent value="vehicles">
          <AmbulanceVehiclesTab options={ambulanceOptions} />
        </TabsContent>
      )}
      
      {user.role === 'admin' && (
        <TabsContent value="admin">
          <AdminTab />
        </TabsContent>
      )}
    </Tabs>
  );
};

interface DashboardOverviewTabProps {
  pendingRequestsCount: number;
  assignedRequestsCount: number;
  inRouteRequestsCount: number;
  completedRequestsCount: number;
  user: User;
}

const DashboardOverviewTab = ({
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

interface AmbulanceVehiclesTabProps {
  options: Array<{
    title: string;
    description: string;
    icon: any;
    href: string;
    variant: "default" | "outline";
  }>;
}

const AmbulanceVehiclesTab = ({ options }: AmbulanceVehiclesTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gestión de mi Flota</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option) => (
          <Card key={option.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <option.icon className="h-5 w-5 text-primary" />
                {option.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{option.description}</p>
              <Button variant={option.variant} className="w-full" asChild>
                <Link to={option.href}>{option.title}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AdminTab = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Panel de Administración</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gestionar los usuarios del sistema
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/usuarios">Gestionar Usuarios</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ambulance className="h-5 w-5 text-green-500" />
              Vehículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gestionar la flota de vehículos disponibles
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/vehiculos">Gestionar Vehículos</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Configuración del sistema
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/configuracion">Administrar Configuración</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Seguimiento GPS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Ver la ubicación en tiempo real de todos los vehículos
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/tracking">Ver Seguimiento</Link>
            </Button>
          </CardContent>
        </Card>
        
        {user?.role === "admin" && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-yellow-500" />
                Business Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ver estadísticas y análisis de datos
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/bi">Ver Análisis</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="mt-6">
        <Button asChild>
          <Link to="/admin/dashboard">Panel de Administración Completo</Link>
        </Button>
      </div>
    </div>
  );
};
