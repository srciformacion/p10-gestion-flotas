
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Ambulance, Clock, MapPin, Route, MessageSquare } from "lucide-react";

interface AssignedBatch {
  id: string;
  name: string;
  date: string;
  vehicleId: string;
  vehiclePlate: string;
  totalServices: number;
  completedServices: number;
  estimatedDuration: string;
  status: 'pending' | 'active' | 'completed';
}

const DriverDashboard = () => {
  const { user } = useAuth();
  const [assignedBatch, setAssignedBatch] = useState<AssignedBatch | null>(null);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setAssignedBatch({
      id: 'lote-001',
      name: 'Ruta Hospitales Centro',
      date: new Date().toISOString().split('T')[0],
      vehicleId: 'AMB-001',
      vehiclePlate: 'ABC-1234',
      totalServices: 8,
      completedServices: 3,
      estimatedDuration: '6h 30m',
      status: 'active'
    });
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getProgressPercentage = () => {
    if (!assignedBatch) return 0;
    return Math.round((assignedBatch.completedServices / assignedBatch.totalServices) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-blue-100">
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Today's Assignment */}
      {assignedBatch ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ambulance className="h-5 w-5 text-blue-600" />
              Mi Ruta de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Lote Asignado</p>
                <p className="font-medium">{assignedBatch.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehículo</p>
                <p className="font-medium">{assignedBatch.vehicleId} - {assignedBatch.vehiclePlate}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{assignedBatch.totalServices}</div>
                <div className="text-sm text-muted-foreground">Servicios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{assignedBatch.completedServices}</div>
                <div className="text-sm text-muted-foreground">Completados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{assignedBatch.estimatedDuration}</div>
                <div className="text-sm text-muted-foreground">Duración</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso del día</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link to={`/driver/batch-view/${assignedBatch.id}`} className="flex-1">
                <Button className="w-full">
                  <Route className="h-4 w-4 mr-2" />
                  Ver Resumen del Lote
                </Button>
              </Link>
              <Link to={`/driver/route-details/${assignedBatch.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver Paradas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Ambulance className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Sin asignación para hoy</h3>
            <p className="text-muted-foreground">
              No tienes servicios asignados para el día de hoy.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comunicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Contacta con el centro coordinador para reportar incidencias o dudas.
            </p>
            <Link to="/mensajes">
              <Button variant="outline" className="w-full">
                Abrir Mensajes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Estado del Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge 
                className={
                  assignedBatch?.status === 'active' ? 'bg-green-500' :
                  assignedBatch?.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                }
              >
                {assignedBatch?.status === 'active' ? 'En Servicio' :
                 assignedBatch?.status === 'pending' ? 'Pendiente' : 'Completado'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Estado actual de tu jornada de trabajo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverDashboard;
