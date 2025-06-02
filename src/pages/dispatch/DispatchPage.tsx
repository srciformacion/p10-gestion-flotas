
import { useState } from "react";
import { Zap, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const DispatchPage = () => {
  const [events] = useState([
    {
      id: '1',
      type: 'request_created',
      description: 'Nueva solicitud de emergencia',
      priority: 'emergency',
      timestamp: '2024-01-15T10:30:00Z',
      resolved: false
    },
    {
      id: '2',
      type: 'ambulance_assigned',
      description: 'Ambulancia AMB-001 asignada',
      priority: 'medium',
      timestamp: '2024-01-15T10:25:00Z',
      resolved: true
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Zap className="h-8 w-8" />
        Despacho Inteligente IA
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Eventos en Tiempo Real
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    {event.resolved ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{event.description}</span>
                      <Badge className={`${getPriorityColor(event.priority)} text-white text-xs`}>
                        {event.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {!event.resolved && (
                    <Button size="sm" variant="outline">
                      Resolver
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recomendaciones IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Optimización sugerida</p>
                  <p className="text-sm text-muted-foreground">
                    Reasignar AMB-002 para reducir tiempo de respuesta en 15%
                  </p>
                  <Button size="sm" className="mt-2">
                    Aplicar
                  </Button>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium">Alerta predictiva</p>
                  <p className="text-sm text-muted-foreground">
                    Posible congestión de tráfico en Zona Centro
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Ver detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Ambulancias disponibles</span>
                  <Badge className="bg-green-500">5/8</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Solicitudes pendientes</span>
                  <Badge className="bg-yellow-500">3</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tiempo promedio respuesta</span>
                  <span className="text-sm font-medium">12 min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DispatchPage;
