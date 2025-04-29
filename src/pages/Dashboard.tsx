
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Ambulance, Clock, MapPin, Users, Settings } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentRequests } from "@/components/dashboard/RecentRequests";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RequestsList } from "@/components/dashboard/RequestsList";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { RequireAuth } from "@/components/RequireAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
    
  // Opciones específicas para empresa de ambulancias
  const ambulanceOptions = [
    {
      title: "Gestión de Vehículos",
      description: "Administrar mi flota de ambulancias",
      icon: Ambulance,
      href: "/vehiculos",
      variant: "default",
    },
    {
      title: "Solicitudes Activas",
      description: "Ver solicitudes asignadas a mi flota",
      icon: FileText,
      href: "/solicitudes?status=assigned",
      variant: "outline",
    },
    {
      title: "Seguimiento GPS",
      description: "Ver la ubicación en tiempo real de mis vehículos",
      icon: MapPin,
      href: "/seguimiento",
      variant: "outline",
    }
  ];

  return (
    <RequireAuth>
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
                {user.role === 'ambulance' && <TabsTrigger value="vehicles">Vehículos</TabsTrigger>}
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
                  <RecentRequests />
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
              
              {user.role === 'ambulance' && (
                <TabsContent value="vehicles">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Gestión de mi Flota</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {ambulanceOptions.map((option) => (
                        <Card key={option.title} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <option.icon className="h-5 w-5 text-primary" />
                              {option.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">{option.description}</p>
                            <Button variant={option.variant as "default" | "outline"} className="w-full" asChild>
                              <Link to={option.href}>{option.title}</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {user.role === 'admin' && (
                <TabsContent value="admin">
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
                    </div>
                    
                    <div className="mt-6">
                      <Button asChild>
                        <Link to="/admin/dashboard">Panel de Administración Completo</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default Dashboard;
