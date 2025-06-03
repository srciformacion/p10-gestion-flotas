
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Truck, User, MapPin, Star } from "lucide-react";
import { VehicleDetails } from "@/types/vehicle";

interface VehicleSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleSelect: (vehicle: VehicleDetails, eta: string) => void;
  isUpdating: boolean;
}

// Mock data - En producción esto vendría de una API
const mockAvailableVehicles: VehicleDetails[] = [
  {
    id: "amb-001",
    vehicleId: "AMB-001",
    licensePlate: "1234 ABC",
    model: "Mercedes Sprinter 2023",
    type: "Tipo A",
    status: "available",
    currentLocation: {
      lat: 42.2328,
      lng: -2.4623,
      address: "Hospital San Pedro, Logroño",
      lastUpdated: new Date().toISOString()
    },
    driver: {
      id: "driver-1",
      name: "Carlos Martínez",
      phone: "+34 666 123 456",
      licenseNumber: "12345678A",
      experience: "8 años de experiencia",
      rating: 4.8,
      avatar: "/placeholder.svg"
    },
    medic: {
      id: "medic-1",
      name: "Dra. Ana García",
      phone: "+34 666 789 012",
      specialization: "Medicina de Urgencias",
      experience: "12 años de experiencia",
      rating: 4.9,
      avatar: "/placeholder.svg"
    },
    equipment: ["Desfibrilador", "Oxígeno", "Monitor cardíaco", "Camilla hidráulica"],
    capacity: 2,
    fuelLevel: 85
  },
  {
    id: "amb-002",
    vehicleId: "AMB-002",
    licensePlate: "5678 DEF",
    model: "Volkswagen Crafter 2022",
    type: "Tipo B",
    status: "available",
    currentLocation: {
      lat: 42.4628,
      lng: -2.4447,
      address: "Centro de Salud Espartero, Logroño",
      lastUpdated: new Date().toISOString()
    },
    driver: {
      id: "driver-2",
      name: "Miguel López",
      phone: "+34 666 345 678",
      licenseNumber: "87654321B",
      experience: "5 años de experiencia",
      rating: 4.6
    },
    equipment: ["Silla de ruedas", "Oxígeno portátil", "Botiquín avanzado"],
    capacity: 1,
    fuelLevel: 92
  }
];

export const VehicleSelector = ({ 
  open, 
  onOpenChange, 
  onVehicleSelect, 
  isUpdating 
}: VehicleSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);
  const [eta, setEta] = useState("");

  const filteredVehicles = mockAvailableVehicles.filter(vehicle =>
    vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.driver?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleConfirm = () => {
    if (selectedVehicle && eta) {
      onVehicleSelect(selectedVehicle, eta);
      setSelectedVehicle(null);
      setEta("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Seleccionar Vehículo</DialogTitle>
          <DialogDescription>
            Seleccione un vehículo disponible y establezca la hora estimada de llegada
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, matrícula o conductor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Lista de vehículos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto max-h-96">
            {filteredVehicles.map((vehicle) => (
              <Card 
                key={vehicle.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedVehicle?.id === vehicle.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {vehicle.vehicleId}
                    </CardTitle>
                    <Badge className={`${getStatusColor(vehicle.status)} text-white text-xs`}>
                      {vehicle.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Modelo:</span>
                      <p className="font-medium truncate">{vehicle.model}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tipo:</span>
                      <p className="font-medium">{vehicle.type}</p>
                    </div>
                  </div>

                  {/* Conductor */}
                  {vehicle.driver && (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={vehicle.driver.avatar} />
                        <AvatarFallback className="text-xs">
                          {vehicle.driver.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium truncate">{vehicle.driver.name}</p>
                          {vehicle.driver.rating && (
                            <div className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs">{vehicle.driver.rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{vehicle.driver.experience}</p>
                      </div>
                    </div>
                  )}

                  {/* Ubicación */}
                  {vehicle.currentLocation && (
                    <div className="flex items-start gap-2 text-xs">
                      <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{vehicle.currentLocation.address}</span>
                    </div>
                  )}

                  {/* Equipamiento */}
                  <div className="flex flex-wrap gap-1">
                    {vehicle.equipment.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                    {vehicle.equipment.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vehicle.equipment.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ETA Input */}
          {selectedVehicle && (
            <div className="space-y-2 p-4 bg-muted rounded-lg">
              <Label htmlFor="eta">Hora estimada de llegada</Label>
              <Input
                id="eta"
                type="datetime-local"
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedVehicle || !eta || isUpdating}
          >
            {isUpdating ? "Asignando..." : "Asignar Vehículo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
