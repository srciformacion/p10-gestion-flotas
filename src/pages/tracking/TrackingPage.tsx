
import { useState } from "react";
import { MapPin, Navigation, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAmbulances } from "@/services/api/mock-data";

const TrackingPage = () => {
  const [ambulances] = useState(mockAmbulances);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Seguimiento en Tiempo Real</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Mapa de Ambulancias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Mapa interactivo en desarrollo</p>
                  <p className="text-sm text-gray-400">
                    Aquí se mostrará la ubicación en tiempo real de las ambulancias
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ambulancias Activas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ambulances.map((ambulance) => (
                <div key={ambulance.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <strong className="text-sm">{ambulance.vehicleId}</strong>
                    <Badge 
                      className={
                        ambulance.status === 'available' ? 'bg-green-500' :
                        ambulance.status === 'busy' ? 'bg-yellow-500' : 'bg-red-500'
                      }
                    >
                      {ambulance.status}
                    </Badge>
                  </div>
                  
                  {ambulance.currentLocation && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Navigation className="h-3 w-3" />
                        <span>{ambulance.currentLocation.address}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Actualizado hace 2 min</span>
                      </div>
                    </div>
                  )}

                  {ambulance.assignedDriver && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Conductor: {ambulance.assignedDriver}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
