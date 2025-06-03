
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Truck, User, Phone, MapPin, Clock, Star, Fuel, Activity, Wifi, WifiOff } from "lucide-react";
import { VehicleDetails } from "@/types/vehicle";

interface EnhancedVehicleInfoProps {
  vehicle?: VehicleDetails;
  estimatedArrival?: string;
  formatDateTime: (date: string) => string;
}

export const EnhancedVehicleInfo = ({ 
  vehicle, 
  estimatedArrival, 
  formatDateTime 
}: EnhancedVehicleInfoProps) => {
  if (!vehicle) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500 text-green-50';
      case 'busy': return 'bg-yellow-500 text-yellow-50';
      case 'maintenance': return 'bg-red-500 text-red-50';
      case 'offline': return 'bg-gray-500 text-gray-50';
      default: return 'bg-gray-500 text-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <Activity className="h-3 w-3" />;
      case 'busy': return <Truck className="h-3 w-3" />;
      case 'maintenance': return <WifiOff className="h-3 w-3" />;
      case 'offline': return <WifiOff className="h-3 w-3" />;
      default: return <Wifi className="h-3 w-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'busy': return 'Ocupada';
      case 'maintenance': return 'Mantenimiento';
      case 'offline': return 'Fuera de línea';
      default: return status;
    }
  };

  const getFuelColor = (fuelLevel?: number) => {
    if (!fuelLevel) return 'bg-gray-300';
    if (fuelLevel < 25) return 'bg-red-500';
    if (fuelLevel < 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Tipo A': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Tipo B': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Tipo C': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isOnline = vehicle.currentLocation?.lastUpdated;
  const lastUpdateMinutes = isOnline ? 
    Math.floor((new Date().getTime() - new Date(vehicle.currentLocation.lastUpdated).getTime()) / 60000) : null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
        <Truck className="h-4 w-4" />
        Información del Vehículo Asignado
      </h3>
      <Separator className="my-2" />
      
      {/* Información básica del vehículo */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {vehicle.vehicleId}
                <div className="flex items-center gap-1 text-xs">
                  {getStatusIcon(vehicle.status)}
                  {isOnline && lastUpdateMinutes !== null && lastUpdateMinutes < 5 && (
                    <span className="text-green-500">●</span>
                  )}
                </div>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={`${getStatusColor(vehicle.status)} flex items-center gap-1 px-2 py-1`}>
                {getStatusIcon(vehicle.status)}
                {getStatusText(vehicle.status)}
              </Badge>
              <Badge variant="outline" className={getTypeColor(vehicle.type)}>
                {vehicle.type}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Modelo</Label>
              <p className="font-medium">{vehicle.model}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Capacidad</Label>
              <p className="font-medium">{vehicle.capacity} pacientes</p>
            </div>
          </div>

          {/* Nivel de combustible */}
          {vehicle.fuelLevel !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Fuel className="h-3 w-3" />
                  Combustible
                </Label>
                <span className="text-sm font-medium">{vehicle.fuelLevel}%</span>
              </div>
              <Progress 
                value={vehicle.fuelLevel} 
                className={`h-2 ${getFuelColor(vehicle.fuelLevel)}`}
              />
              {vehicle.fuelLevel < 25 && (
                <p className="text-xs text-red-600">⚠️ Nivel de combustible bajo</p>
              )}
            </div>
          )}

          {/* Ubicación actual con estado en tiempo real */}
          {vehicle.currentLocation && (
            <div className="p-3 bg-muted rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-xs text-muted-foreground">Ubicación Actual</Label>
                </div>
                {isOnline && (
                  <div className="flex items-center gap-1">
                    {lastUpdateMinutes !== null && lastUpdateMinutes < 5 ? (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        En línea
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        {lastUpdateMinutes}min
                      </span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm">{vehicle.currentLocation.address}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Coordenadas: {vehicle.currentLocation.lat.toFixed(4)}, {vehicle.currentLocation.lng.toFixed(4)}
                </span>
                {vehicle.currentLocation.lastUpdated && (
                  <span>
                    {formatDateTime(vehicle.currentLocation.lastUpdated)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ETA */}
          {estimatedArrival && (
            <div className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800 font-medium">ETA:</span>
              <span className="font-medium text-blue-900">{formatDateTime(estimatedArrival)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del conductor */}
      {vehicle.driver && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Conductor Asignado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={vehicle.driver.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {vehicle.driver.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{vehicle.driver.name}</p>
                    {vehicle.driver.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{vehicle.driver.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{vehicle.driver.experience}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{vehicle.driver.phone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Licencia:</span> {vehicle.driver.licenseNumber}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del médico */}
      {vehicle.medic && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Médico Asignado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={vehicle.medic.avatar} />
                <AvatarFallback className="bg-green-100 text-green-700">
                  {vehicle.medic.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{vehicle.medic.name}</p>
                    {vehicle.medic.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{vehicle.medic.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-blue-600 font-medium">{vehicle.medic.specialization}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.medic.experience}</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Phone className="h-3 w-3" />
                  <span>{vehicle.medic.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipamiento disponible */}
      {vehicle.equipment && vehicle.equipment.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Equipamiento Disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {vehicle.equipment.map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
