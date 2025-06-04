
import { useParams } from "react-router-dom";
import { MapPin, Fuel, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAmbulances } from "@/services/api/mock-data";
import { AppLayout } from "@/components/layout/AppLayout";

const AmbulanceDetail = () => {
  const { id } = useParams();
  const ambulance = mockAmbulances.find(amb => amb.id === id);

  if (!ambulance) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Ambulancia no encontrada</h2>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">{ambulance.vehicleId}</h1>
          <Badge className="bg-green-500 text-white">{ambulance.status}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Matrícula:</strong> {ambulance.licensePlate}
              </div>
              <div>
                <strong>Modelo:</strong> {ambulance.model}
              </div>
              <div>
                <strong>Tipo:</strong> {ambulance.type}
              </div>
              <div>
                <strong>Capacidad:</strong> {ambulance.capacity} pacientes
              </div>
              <div>
                <strong>Conductor:</strong> {ambulance.assignedDriver || 'No asignado'}
              </div>
              <div>
                <strong>Médico:</strong> {ambulance.assignedMedic || 'No asignado'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Estado y Mantenimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Nivel de combustible:</strong> {ambulance.fuelLevel}%
              </div>
              <div>
                <strong>Último mantenimiento:</strong> {ambulance.lastMaintenance}
              </div>
              <div>
                <strong>Próximo mantenimiento:</strong> {ambulance.nextMaintenance}
              </div>
              {ambulance.currentLocation && (
                <div>
                  <strong>Ubicación actual:</strong> {ambulance.currentLocation.address}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Equipamiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ambulance.equipment.map((item, index) => (
                <Badge key={index} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AmbulanceDetail;
