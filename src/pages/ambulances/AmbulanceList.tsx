
import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAmbulances } from "@/services/api/mock-data";

const AmbulanceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAmbulances = mockAmbulances.filter(ambulance => {
    const matchesSearch = ambulance.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ambulance.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ambulance.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Ambulancias</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Ambulancia
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID o matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAmbulances.map((ambulance) => (
          <Card key={ambulance.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{ambulance.vehicleId}</CardTitle>
                <Badge className={`${getStatusColor(ambulance.status)} text-white`}>
                  {ambulance.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{ambulance.licensePlate}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Modelo:</strong> {ambulance.model}</p>
                <p><strong>Tipo:</strong> {ambulance.type}</p>
                <p><strong>Capacidad:</strong> {ambulance.capacity} pacientes</p>
                {ambulance.currentLocation && (
                  <p><strong>Ubicación:</strong> {ambulance.currentLocation.address}</p>
                )}
                {ambulance.fuelLevel && (
                  <p><strong>Combustible:</strong> {ambulance.fuelLevel}%</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AmbulanceList;
