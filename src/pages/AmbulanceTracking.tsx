
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveMap } from "@/components/map/LiveMap";
import { locationService } from "@/services/api/location";
import { VehicleLocation } from "@/types/location";
import { useRequests } from "@/context/RequestsContext";
import { ArrowLeft, Clock, MapPin, Navigation, Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusNotification } from "@/components/notifications/StatusNotification";
import { Badge } from "@/components/ui/badge";

const AmbulanceTracking = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { getRequestById } = useRequests();
  const [request, setRequest] = useState(getRequestById(requestId || ""));
  const [vehicle, setVehicle] = useState<VehicleLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;
    
    const foundRequest = getRequestById(requestId);
    setRequest(foundRequest);

    if (!foundRequest?.assignedVehicle) return;

    const fetchVehicleData = async () => {
      try {
        setLoading(true);
        const vehicleData = await locationService.getVehicleLocation(foundRequest.assignedVehicle!);
        setVehicle(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
    const interval = setInterval(fetchVehicleData, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, [requestId, getRequestById]);

  // Actualizar tiempo estimado restante
  useEffect(() => {
    if (!request?.estimatedArrival) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const eta = new Date(request.estimatedArrival!);
      
      if (now > eta) {
        setTimeRemaining("Llegada inminente");
        return;
      }
      
      const diff = eta.getTime() - now.getTime();
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 1) {
        setTimeRemaining("Menos de 1 minuto");
      } else {
        setTimeRemaining(`${minutes} minuto${minutes !== 1 ? 's' : ''}`);
      }
    };
    
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 15000);
    
    return () => clearInterval(interval);
  }, [request?.estimatedArrival]);

  if (!request) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Solicitud no encontrada</h1>
            <Button asChild>
              <Link to="/">Volver al inicio</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-1" /> Volver
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Seguimiento de traslado</h1>
          </div>

          {/* Notificación de estado */}
          <StatusNotification 
            request={request} 
            show={true} 
            onClose={() => {}} 
          />

          {/* Tarjeta principal */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" /> Detalles del traslado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Paciente</h3>
                  <p className="font-semibold text-lg">{request.patientName}</p>
                  <p className="text-sm text-gray-500 mb-4">ID: {request.patientId}</p>
                  
                  <h3 className="font-medium text-gray-500 mb-1">Origen</h3>
                  <p className="mb-2">{request.origin}</p>
                  
                  <h3 className="font-medium text-gray-500 mb-1">Destino</h3>
                  <p>{request.destination}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Estado del traslado</h3>
                  <div className="mb-4 flex items-center">
                    <Badge 
                      className={
                        request.status === 'completed' ? "bg-green-100 text-green-800 border-green-300" :
                        request.status === 'cancelled' ? "bg-red-100 text-red-800 border-red-300" : 
                        request.status === 'inRoute' ? "bg-purple-100 text-purple-800 border-purple-300" :
                        request.status === 'assigned' ? "bg-amber-100 text-amber-800 border-amber-300" :
                        "bg-blue-100 text-blue-800 border-blue-300"
                      }
                    >
                      {request.status === 'completed' ? "Completado" :
                       request.status === 'cancelled' ? "Cancelado" :
                       request.status === 'inRoute' ? "En camino" :
                       request.status === 'assigned' ? "Ambulancia asignada" :
                       "Pendiente"}
                    </Badge>
                  </div>
                  
                  {(request.status === 'assigned' || request.status === 'inRoute') && (
                    <>
                      <h3 className="font-medium text-gray-500 mb-1">Vehículo asignado</h3>
                      <p className="mb-4">{request.assignedVehicle || "Pendiente de asignación"}</p>
                      
                      {request.estimatedArrival && (
                        <div className="space-y-2">
                          <h3 className="font-medium text-gray-500 mb-1">Tiempo estimado de llegada</h3>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-600" />
                            <span className="font-bold text-lg">
                              {new Date(request.estimatedArrival).toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          
                          {timeRemaining && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Navigation className="h-4 w-4" />
                              <span>Llegada estimada en {timeRemaining}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mapa de seguimiento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Seguimiento en tiempo real
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[400px] w-full" />
              ) : (
                <div className="h-[400px]">
                  <LiveMap 
                    height="400px" 
                    showControls={false} 
                    centerOnVehicle={request.assignedVehicle}
                    highlightRequest={requestId}
                  />
                </div>
              )}

              {(request.status === 'assigned' || request.status === 'inRoute') && vehicle && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Velocidad</Badge>
                    <span>{Math.round(vehicle.location.speed)} km/h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Última actualización</Badge>
                    <span>{new Date(vehicle.location.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AmbulanceTracking;
