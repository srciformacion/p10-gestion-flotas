
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRequests } from "@/context/RequestsContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RequestStatusBadge } from "@/components/RequestStatusBadge";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RequestStatus } from "@/types";
import { Search, Ambulance, FileText, CalendarCheck, Clock } from "lucide-react";
import { RequireAuth } from "@/components/RequireAuth";

const RequestList = () => {
  const { user } = useAuth();
  const { requests } = useRequests();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  
  // Obtener el estado del query param si existe
  const queryParams = new URLSearchParams(location.search);
  const statusParam = queryParams.get("status") as RequestStatus | null;
  
  // Usar el estado del query param para inicializar el filtro
  useState(() => {
    if (statusParam && ["pending", "assigned", "inRoute", "completed", "cancelled"].includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  });
  
  // Filtrar solicitudes según rol del usuario
  const userRequests = user?.role === 'individual'
    ? requests.filter(req => req.createdBy === user.id)
    : requests;
  
  // Aplicar filtros
  const filteredRequests = userRequests.filter(request => {
    // Filtrar por estado
    if (statusFilter !== "all" && request.status !== statusFilter) {
      return false;
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        request.patientName.toLowerCase().includes(searchTermLower) ||
        request.patientId.toLowerCase().includes(searchTermLower) ||
        request.origin.toLowerCase().includes(searchTermLower) ||
        request.destination.toLowerCase().includes(searchTermLower)
      );
    }
    
    return true;
  });

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
                Solicitudes de Transporte
              </h1>
              
              {(user?.role === 'hospital' || user?.role === 'individual') && (
                <Link to="/nueva-solicitud">
                  <Button>Nueva Solicitud</Button>
                </Link>
              )}
            </div>
            
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por paciente, origen o destino..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <Button
                      variant={statusFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("all")}
                    >
                      Todas
                    </Button>
                    <Button
                      variant={statusFilter === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("pending")}
                      className="flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3" /> Pendientes
                    </Button>
                    <Button
                      variant={statusFilter === "assigned" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("assigned")}
                      className="flex items-center gap-1"
                    >
                      <CalendarCheck className="h-3 w-3" /> Asignadas
                    </Button>
                    <Button
                      variant={statusFilter === "inRoute" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("inRoute")}
                      className="flex items-center gap-1"
                    >
                      <Ambulance className="h-3 w-3" /> En ruta
                    </Button>
                    <Button
                      variant={statusFilter === "completed" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter("completed")}
                      className="flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" /> Completadas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-6 flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{request.patientName}</h3>
                            <RequestStatusBadge status={request.status} />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">ID: {request.patientId}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm"><span className="font-medium">Origen:</span> {request.origin}</p>
                            <p className="text-sm"><span className="font-medium">Destino:</span> {request.destination}</p>
                            <p className="text-sm">
                              <span className="font-medium">Fecha:</span>{" "}
                              {new Date(request.dateTime).toLocaleDateString('es-ES', { 
                                day: '2-digit', 
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit', 
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col justify-between">
                          <div>
                            <p className="text-sm mb-1"><span className="font-medium">Tipo:</span> {
                              request.transportType === 'stretcher' ? 'Camilla' : 
                              request.transportType === 'wheelchair' ? 'Silla de ruedas' : 'Andando'
                            }</p>
                            {request.assignedVehicle && (
                              <p className="text-sm"><span className="font-medium">Vehículo:</span> {request.assignedVehicle}</p>
                            )}
                            {request.estimatedArrival && (
                              <p className="text-sm"><span className="font-medium">ETA:</span> {
                                new Date(request.estimatedArrival).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              }</p>
                            )}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4 self-end"
                            onClick={() => navigate(`/solicitudes/${request.id}`)}
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No hay solicitudes</h3>
                  {statusFilter !== "all" ? (
                    <p className="text-muted-foreground text-center max-w-md">
                      No se encontraron solicitudes con el estado seleccionado. Intenta cambiar el filtro o realizar una nueva búsqueda.
                    </p>
                  ) : searchTerm ? (
                    <p className="text-muted-foreground text-center max-w-md">
                      No se encontraron solicitudes que coincidan con tu búsqueda. Intenta con otros términos.
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-center max-w-md">
                      No hay solicitudes de transporte registradas en el sistema.
                      {(user?.role === 'hospital' || user?.role === 'individual') && (
                        <> Puedes crear una nueva solicitud haciendo clic en el botón "Nueva Solicitud".</>
                      )}
                    </p>
                  )}
                  
                  {(user?.role === 'hospital' || user?.role === 'individual') && (
                    <Link to="/nueva-solicitud" className="mt-4">
                      <Button>Nueva Solicitud</Button>
                    </Link>
                  )}
                  
                  {statusFilter !== "all" && (
                    <Button 
                      variant="link" 
                      onClick={() => setStatusFilter("all")}
                      className="mt-2"
                    >
                      Ver todas las solicitudes
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default RequestList;
