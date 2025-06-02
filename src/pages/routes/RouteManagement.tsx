
import { useState } from "react";
import { Plus, Route, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRoutes } from "@/services/api/mock-data";

const RouteManagement = () => {
  const [routes] = useState(mockRoutes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Rutas</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Ruta
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routes.map((route) => (
          <Card key={route.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  {route.name}
                </CardTitle>
                <Badge className={`${getStatusColor(route.status)} text-white`}>
                  {route.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Ambulancia: {route.ambulanceId}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Duración estimada: {route.estimatedDuration} min
                </span>
              </div>

              <div className="space-y-2">
                <strong className="text-sm">Puntos de la ruta:</strong>
                {route.points.map((point, index) => (
                  <div key={index} className="text-sm border-l-2 border-gray-200 pl-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {point.type}
                      </Badge>
                      <span>{point.address}</span>
                    </div>
                    {point.estimatedTime && (
                      <div className="text-xs text-muted-foreground">
                        Hora estimada: {point.estimatedTime}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">
                Distancia: {route.distance} km | 
                {route.optimized ? ' Optimizada' : ' Sin optimizar'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RouteManagement;
