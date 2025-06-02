
import { useState } from "react";
import { MapPin, Route, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MobileTeamDashboard = () => {
  const [currentRoute] = useState({
    id: 'route-001',
    name: 'Ruta Hospitales Centro',
    status: 'active',
    nextStop: 'Hospital La Paz',
    eta: '15 min',
    progress: 60
  });

  const [assignedServices] = useState([
    {
      id: 'req-001',
      patientName: 'Ana Martínez',
      origin: 'Hospital Clínico San Carlos',
      destination: 'Hospital La Paz',
      status: 'in_route',
      priority: 'medium'
    }
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de Equipo Móvil</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Ruta Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{currentRoute.name}</h3>
                <p className="text-muted-foreground">Próxima parada: {currentRoute.nextStop}</p>
              </div>
              <Badge className="bg-green-500 text-white">
                {currentRoute.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">ETA: {currentRoute.eta}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${currentRoute.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              Progreso: {currentRoute.progress}%
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Servicios Asignados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedServices.map((service) => (
              <div key={service.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">Paciente: {service.patientName}</h4>
                    <p className="text-sm text-muted-foreground">ID: {service.id}</p>
                  </div>
                  <Badge 
                    className={
                      service.priority === 'emergency' ? 'bg-red-500' :
                      service.priority === 'high' ? 'bg-orange-500' :
                      service.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }
                  >
                    {service.priority}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Origen:</span>
                    <span className="text-sm">{service.origin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Destino:</span>
                    <span className="text-sm">{service.destination}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    Ver detalles
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marcar completado
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ubicación Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Mapa de ubicación</p>
              <p className="text-sm text-gray-400">
                Geolocalización en tiempo real
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileTeamDashboard;
