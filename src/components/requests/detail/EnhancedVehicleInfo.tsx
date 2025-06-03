
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Truck, User, Phone, MapPin, Clock, Star } from "lucide-react";
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
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

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
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{vehicle.vehicleId}</CardTitle>
            <Badge className={`${getStatusColor(vehicle.status)} text-white`}>
              {vehicle.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Modelo</Label>
              <p className="font-medium">{vehicle.model}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Tipo</Label>
              <p className="font-medium">{vehicle.type}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Capacidad</Label>
              <p className="font-medium">{vehicle.capacity} pacientes</p>
            </div>
            {vehicle.fuelLevel && (
              <div>
                <Label className="text-xs text-muted-foreground">Combustible</Label>
                <p className="font-medium">{vehicle.fuelLevel}%</p>
              </div>
            )}
          </div>

          {/* Ubicación actual */}
          {vehicle.currentLocation && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Label className="text-xs text-muted-foreground">Ubicación Actual</Label>
              </div>
              <p className="text-sm">{vehicle.currentLocation.address}</p>
              {vehicle.currentLocation.lastUpdated && (
                <p className="text-xs text-muted-foreground mt-1">
                  Actualizado: {formatDateTime(vehicle.currentLocation.lastUpdated)}
                </p>
              )}
            </div>
          )}

          {/* ETA */}
          {estimatedArrival && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Hora estimada de llegada:</span>
              <span className="font-medium">{formatDateTime(estimatedArrival)}</span>
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
                <AvatarFallback>
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
                        <span className="text-xs">{vehicle.driver.rating}</span>
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
                <AvatarFallback>
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
                        <span className="text-xs">{vehicle.medic.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{vehicle.medic.specialization}</p>
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

      {/* Equipamiento */}
      {vehicle.equipment && vehicle.equipment.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Equipamiento Disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {vehicle.equipment.map((item, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
