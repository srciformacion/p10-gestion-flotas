
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Route, MapPin, Clock, Ambulance } from "lucide-react";

interface BatchDetails {
  id: string;
  name: string;
  description: string;
  scheduledDate: string;
  vehicle: {
    id: string;
    name: string;
    licensePlate: string;
  };
  totalServices: number;
  completedServices: number;
  estimatedDuration: number;
  totalDistance: number;
  status: 'draft' | 'planned' | 'active' | 'completed';
  notes?: string;
}

const BatchViewPage = () => {
  const { loteId } = useParams();
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setBatchDetails({
      id: loteId || '',
      name: 'Ruta Hospitales Centro',
      description: 'Transporte programado entre hospitales del centro de la ciudad',
      scheduledDate: new Date().toISOString(),
      vehicle: {
        id: 'AMB-001',
        name: 'Ambulancia Alpha',
        licensePlate: 'ABC-1234'
      },
      totalServices: 8,
      completedServices: 3,
      estimatedDuration: 390, // minutes
      totalDistance: 45.2, // km
      status: 'active',
      notes: 'Ruta optimizada automáticamente. Verificar horarios de los centros de destino.'
    });
  }, [loteId]);

  const getProgressPercentage = () => {
    if (!batchDetails) return 0;
    return Math.round((batchDetails.completedServices / batchDetails.totalServices) * 100);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Borrador', className: 'bg-gray-500' },
      planned: { label: 'Planificado', className: 'bg-blue-500' },
      active: { label: 'Activo', className: 'bg-green-500' },
      completed: { label: 'Completado', className: 'bg-gray-600' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (!batchDetails) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando detalles del lote...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{batchDetails.name}</h1>
          <p className="text-muted-foreground">Lote ID: {batchDetails.id}</p>
        </div>
        {getStatusBadge(batchDetails.status)}
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Información del Lote
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Descripción</p>
              <p className="font-medium">{batchDetails.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha Programada</p>
              <p className="font-medium">
                {new Date(batchDetails.scheduledDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          {batchDetails.notes && (
            <div>
              <p className="text-sm text-muted-foreground">Notas Importantes</p>
              <p className="font-medium text-orange-700 bg-orange-50 p-3 rounded-md">
                {batchDetails.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ambulance className="h-5 w-5" />
            Vehículo Asignado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Identificación</p>
              <p className="font-medium">{batchDetails.vehicle.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Matrícula</p>
              <p className="font-medium">{batchDetails.vehicle.licensePlate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Resumen de la Ruta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{batchDetails.totalServices}</div>
              <div className="text-sm text-muted-foreground">Total Servicios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{batchDetails.completedServices}</div>
              <div className="text-sm text-muted-foreground">Completados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{formatDuration(batchDetails.estimatedDuration)}</div>
              <div className="text-sm text-muted-foreground">Duración Est.</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{batchDetails.totalDistance} km</div>
              <div className="text-sm text-muted-foreground">Distancia</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso del Lote</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <Card>
        <CardContent className="pt-6">
          <Link to={`/driver/route-details/${batchDetails.id}`}>
            <Button className="w-full" size="lg">
              <Clock className="h-4 w-4 mr-2" />
              Ver Detalles de las Paradas
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchViewPage;
