
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestStatusBadge } from "@/components/RequestStatusBadge";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Ambulance, Clock, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { requests, filteredRequests } = useRequests();
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
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="requests">Solicitudes</TabsTrigger>
              {user.role === 'admin' && <TabsTrigger value="admin">Administración</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Solicitudes Pendientes
                    </CardTitle>
                    <Clock className="h-4 w-4 text-status-pending" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{pendingRequestsCount}</div>
                    <p className="text-xs text-muted-foreground">
                      {pendingRequestsCount === 1 ? 'Solicitud por asignar' : 'Solicitudes por asignar'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Asignadas
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-status-assigned" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{assignedRequestsCount}</div>
                    <p className="text-xs text-muted-foreground">
                      {assignedRequestsCount === 1 ? 'Vehículo asignado' : 'Vehículos asignados'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      En Ruta
                    </CardTitle>
                    <Ambulance className="h-4 w-4 text-status-inRoute" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{inRouteRequestsCount}</div>
                    <p className="text-xs text-muted-foreground">
                      {inRouteRequestsCount === 1 ? 'Ambulancia en camino' : 'Ambulancias en camino'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completadas
                    </CardTitle>
                    <FileText className="h-4 w-4 text-status-completed" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{completedRequestsCount}</div>
                    <p className="text-xs text-muted-foreground">
                      {completedRequestsCount === 1 ? 'Servicio completado' : 'Servicios completados'}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Solicitudes recientes</CardTitle>
                    <CardDescription>
                      {userRequests.length > 0 
                        ? `${userRequests.length} ${userRequests.length === 1 ? 'solicitud reciente' : 'solicitudes recientes'}`
                        : 'No hay solicitudes recientes'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userRequests.length > 0 ? (
                      <div className="space-y-4">
                        {userRequests.map((request) => (
                          <div key={request.id} className="flex justify-between items-center border-b pb-2">
                            <div>
                              <div className="font-medium">{request.patientName}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(request.dateTime).toLocaleDateString('es-ES', { 
                                  day: '2-digit', 
                                  month: '2-digit',
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </div>
                              <div className="mt-1">
                                <RequestStatusBadge status={request.status} />
                              </div>
                            </div>
                            <Link to={`/solicitudes/${request.id}`}>
                              <Button variant="ghost" size="sm">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No hay solicitudes recientes</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link to="/solicitudes" className="w-full">
                      <Button variant="outline" className="w-full">
                        Ver todas las solicitudes
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Acciones rápidas</CardTitle>
                    <CardDescription>Opciones comunes según tu rol</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(user.role === 'hospital') && (
                      <Link to="/nueva-solicitud" className="w-full">
                        <Button className="w-full">
                          Nueva solicitud de transporte
                        </Button>
                      </Link>
                    )}
                    
                    {user.role === 'ambulance' && pendingRequestsCount > 0 && (
                      <Link to="/solicitudes?status=pending" className="w-full">
                        <Button className="w-full">
                          Ver solicitudes pendientes ({pendingRequestsCount})
                        </Button>
                      </Link>
                    )}
                    
                    {user.role === 'admin' && (
                      <Link to="/admin/usuarios" className="w-full">
                        <Button variant="outline" className="w-full">
                          Gestionar usuarios
                        </Button>
                      </Link>
                    )}
                    
                    <Link to="/perfil" className="w-full">
                      <Button variant="outline" className="w-full">
                        Mi perfil
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="requests">
              <Card>
                <CardHeader>
                  <CardTitle>Todas las solicitudes</CardTitle>
                  <CardDescription>
                    {totalRequestsCount} 
                    {totalRequestsCount === 1 ? ' solicitud en total' : ' solicitudes en total'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userRequests.length > 0 ? (
                      <div className="divide-y">
                        {requests.map((request) => (
                          <div key={request.id} className="flex justify-between items-center py-3">
                            <div>
                              <div className="font-medium">{request.patientName}</div>
                              <div className="text-sm text-muted-foreground">
                                Origen: {request.origin}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Destino: {request.destination}
                              </div>
                              <div className="mt-1">
                                <RequestStatusBadge status={request.status} />
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">
                                {new Date(request.dateTime).toLocaleDateString('es-ES', { 
                                  day: '2-digit', 
                                  month: '2-digit',
                                  hour: '2-digit', 
                                  minute: '2-digit'
                                })}
                              </div>
                              <Link to={`/solicitudes/${request.id}`}>
                                <Button variant="link" size="sm" className="px-0">
                                  Ver detalles
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No hay solicitudes para mostrar</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link to="/solicitudes">
                    <Button variant="outline">Ver todas</Button>
                  </Link>
                  {(user.role === 'hospital') && (
                    <Link to="/nueva-solicitud">
                      <Button>Nueva solicitud</Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            {user.role === 'admin' && (
              <TabsContent value="admin">
                <Card>
                  <CardHeader>
                    <CardTitle>Panel de Administración</CardTitle>
                    <CardDescription>Gestiona usuarios y configuraciones del sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link to="/admin/usuarios">
                      <Button className="w-full mb-2">Gestión de Usuarios</Button>
                    </Link>
                    <Link to="/admin/empresas">
                      <Button variant="outline" className="w-full mb-2">Empresas de Ambulancias</Button>
                    </Link>
                    <Link to="/admin/estadisticas">
                      <Button variant="outline" className="w-full mb-2">Estadísticas del Sistema</Button>
                    </Link>
                    <Link to="/admin/configuracion">
                      <Button variant="outline" className="w-full">Configuración</Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
