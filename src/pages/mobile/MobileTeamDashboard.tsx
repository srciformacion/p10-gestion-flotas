
import { useState, useEffect } from "react";
import { MapPin, Route, Clock, CheckCircle, Users, Navigation, AlertTriangle, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockComplexRoutes, getCurrentActiveRoute, getRouteStats } from "@/services/api/mock-routes";

const MobileTeamDashboard = () => {
  const [currentRoute, setCurrentRoute] = useState(getCurrentActiveRoute());
  const [selectedRouteId, setSelectedRouteId] = useState(currentRoute?.id || '');
  const [stats, setStats] = useState(getRouteStats());

  useEffect(() => {
    const selectedRoute = mockComplexRoutes.find(r => r.id === selectedRouteId) || getCurrentActiveRoute();
    setCurrentRoute(selectedRoute);
  }, [selectedRouteId]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', className: 'bg-yellow-500', icon: Clock },
      en_route_pickup: { label: 'En ruta a recogida', className: 'bg-blue-500', icon: Navigation },
      picked_up: { label: 'Recogido', className: 'bg-orange-500', icon: Users },
      en_route_destination: { label: 'En ruta al destino', className: 'bg-purple-500', icon: Navigation },
      delivered: { label: 'Completado', className: 'bg-green-500', icon: CheckCircle },
      cancelled: { label: 'Cancelado', className: 'bg-red-500', icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const StatusIcon = config.icon;
    
    return (
      <Badge className={config.className}>
        <StatusIcon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getRouteStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-500">
        <Navigation className="h-3 w-3 mr-1" />
        Activa
      </Badge>
    ) : (
      <Badge className="bg-gray-500">
        <CheckCircle className="h-3 w-3 mr-1" />
        Completada
      </Badge>
    );
  };

  const completionPercentage = currentRoute ? 
    Math.round((currentRoute.completedServices / currentRoute.totalServices) * 100) : 0;

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel de Equipo Móvil</h1>
        <Badge className="bg-blue-500 text-white px-3 py-1">
          {stats.activeRoutes} rutas activas
        </Badge>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Route className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.activeRoutes}</p>
                <p className="text-sm text-muted-foreground">Rutas Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalServices}</p>
                <p className="text-sm text-muted-foreground">Servicios Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.completedServices}</p>
                <p className="text-sm text-muted-foreground">Completados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pendingServices}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Ruta Actual</TabsTrigger>
          <TabsTrigger value="all">Todas las Rutas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          {currentRoute && (
            <>
              {/* Información de Ruta Actual */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5" />
                      {currentRoute.name}
                    </CardTitle>
                    {getRouteStatusBadge(currentRoute.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ambulancia</p>
                      <p className="text-lg font-semibold">{currentRoute.ambulanceId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conductor</p>
                      <p className="text-lg">{currentRoute.driverName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Asistente</p>
                      <p className="text-lg">{currentRoute.assistantName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Horario</p>
                      <p className="text-lg">{currentRoute.startTime} - {currentRoute.estimatedEndTime}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso de servicios</span>
                      <span>{currentRoute.completedServices} / {currentRoute.totalServices}</span>
                    </div>
                    <Progress value={completionPercentage} className="w-full" />
                    <p className="text-sm text-muted-foreground">
                      {completionPercentage}% completado
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Servicios Asignados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Servicios Asignados ({currentRoute.services.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentRoute.services.map((service, index) => (
                      <div key={service.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                              {service.orderNumber}
                            </div>
                            <div>
                              <h4 className="font-medium">{service.patientName}</h4>
                              <p className="text-sm text-muted-foreground">ID: {service.id}</p>
                            </div>
                          </div>
                          {getStatusBadge(service.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Origen</p>
                            <div className="flex items-center justify-between">
                              <p className="text-sm">{service.origin}</p>
                              <Button size="sm" variant="outline">
                                <MapPin className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Destino</p>
                            <div className="flex items-center justify-between">
                              <p className="text-sm">{service.destination}</p>
                              <Button size="sm" variant="outline">
                                <MapPin className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Hora Cita</p>
                            <p className="text-sm font-bold">{service.scheduledTime}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Recogida Est.</p>
                            <p className="text-sm">{service.estimatedPickup}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Llegada Est.</p>
                            <p className="text-sm">{service.estimatedArrival}</p>
                          </div>
                        </div>

                        {service.observations && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
                            <p className="text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
                              {service.observations}
                            </p>
                          </div>
                        )}

                        {service.contactPhone && (
                          <div className="flex items-center gap-2 mb-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{service.contactPhone}</span>
                          </div>
                        )}

                        {index === 0 && service.status === 'pending' && (
                          <div className="border-t pt-3">
                            <Button className="w-full">
                              <Navigation className="h-4 w-4 mr-2" />
                              Iniciar Servicio
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {mockComplexRoutes.map((route) => (
              <Card 
                key={route.id} 
                className={`cursor-pointer transition-all ${selectedRouteId === route.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedRouteId(route.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{route.name}</CardTitle>
                    {getRouteStatusBadge(route.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{route.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium">Ambulancia</p>
                      <p className="text-sm text-muted-foreground">{route.ambulanceId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Servicios</p>
                      <p className="text-sm text-muted-foreground">{route.completedServices}/{route.totalServices}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Horario</p>
                      <p className="text-sm text-muted-foreground">{route.startTime} - {route.estimatedEndTime}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Progreso</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((route.completedServices / route.totalServices) * 100)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileTeamDashboard;
