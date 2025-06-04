
import { useState } from "react";
import { MapPin, Navigation, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAmbulances } from "@/services/api/mock-data";
import { InteractiveMap } from "@/components/tracking/InteractiveMap";

const TrackingPage = () => {
  const [ambulances] = useState(mockAmbulances);
  const [selectedAmbulance, setSelectedAmbulance] = useState<string | null>(null);

  // Convertir datos de ambulancias para el mapa
  const ambulanceLocations = ambulances
    .filter(amb => amb.currentLocation)
    .map(amb => ({
      id: amb.id,
      vehicleId: amb.vehicleId,
      lat: amb.currentLocation!.lat,
      lng: amb.currentLocation!.lng,
      status: amb.status,
      address: amb.currentLocation!.address || 'Ubicación desconocida',
      lastUpdate: amb.updatedAt
    }));

  const handleAmbulanceSelect = (ambulanceId: string) => {
    setSelectedAmbulance(ambulanceId);
  };

  const selectedAmbulanceData = ambulances.find(amb => amb.id === selectedAmbulance);

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
              <div className="h-96">
                <InteractiveMap 
                  ambulances={ambulanceLocations}
                  onAmbulanceSelect={handleAmbulanceSelect}
                />
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
                <div 
                  key={ambulance.id} 
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedAmbulance === ambulance.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => handleAmbulanceSelect(ambulance.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <strong className="text-sm">{ambulance.vehicleId}</strong>
                    <Badge 
                      className={
                        ambulance.status === 'available' ? 'bg-green-500' :
                        ambulance.status === 'busy' ? 'bg-yellow-500' : 
                        ambulance.status === 'emergency' ? 'bg-red-500' : 'bg-gray-500'
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

          {/* Información detallada de ambulancia seleccionada */}
          {selectedAmbulanceData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedAmbulanceData.vehicleId}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong className="text-sm">Matrícula:</strong>
                  <p className="text-sm">{selectedAmbulanceData.licensePlate}</p>
                </div>
                <div>
                  <strong className="text-sm">Modelo:</strong>
                  <p className="text-sm">{selectedAmbulanceData.model}</p>
                </div>
                <div>
                  <strong className="text-sm">Tipo:</strong>
                  <p className="text-sm">{selectedAmbulanceData.type}</p>
                </div>
                {selectedAmbulanceData.fuelLevel && (
                  <div>
                    <strong className="text-sm">Combustible:</strong>
                    <p className="text-sm">{selectedAmbulanceData.fuelLevel}%</p>
                  </div>
                )}
                {selectedAmbulanceData.assignedDriver && (
                  <div>
                    <strong className="text-sm">Conductor:</strong>
                    <p className="text-sm">{selectedAmbulanceData.assignedDriver}</p>
                  </div>
                )}
                {selectedAmbulanceData.assignedMedic && (
                  <div>
                    <strong className="text-sm">Médico:</strong>
                    <p className="text-sm">{selectedAmbulanceData.assignedMedic}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
