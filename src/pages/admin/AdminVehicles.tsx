import { useState } from "react";
import Navbar from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { toast } from "sonner";

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  capacity: string;
  status: "available" | "busy" | "maintenance";
}

const AdminVehicles = () => {
  // Estado para manejar los vehículos
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "AMB-001",
      plateNumber: "7654ABC",
      model: "Mercedes Sprinter",
      capacity: "Tipo C",
      status: "available"
    },
    {
      id: "AMB-002",
      plateNumber: "1234XYZ",
      model: "Volkswagen Transporter",
      capacity: "Tipo B",
      status: "busy"
    },
    {
      id: "AMB-003",
      plateNumber: "5678DEF",
      model: "Renault Master",
      capacity: "Tipo A",
      status: "maintenance"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, "id">>({
    plateNumber: "",
    model: "",
    capacity: "",
    status: "available"
  });
  
  const [isAdding, setIsAdding] = useState(false);
  
  // Filtrar vehículos según término de búsqueda
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };
  
  // Añadir nuevo vehículo
  const handleAddVehicle = () => {
    if (!newVehicle.plateNumber || !newVehicle.model || !newVehicle.capacity) {
      toast.error("Por favor, complete todos los campos");
      return;
    }
    
    const id = `AMB-${String(vehicles.length + 1).padStart(3, '0')}`;
    setVehicles(prev => [...prev, { ...newVehicle, id }]);
    setNewVehicle({
      plateNumber: "",
      model: "",
      capacity: "",
      status: "available"
    });
    setIsAdding(false);
    
    toast.success("Vehículo añadido correctamente");
  };
  
  // Eliminar vehículo
  const handleDeleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    toast.success("Vehículo eliminado correctamente");
  };

  return (
    <RequireAuth allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">Gestión de Vehículos</h1>
              <Button onClick={() => setIsAdding(!isAdding)}>
                <Plus className="mr-2 h-4 w-4" />
                {isAdding ? "Cancelar" : "Nuevo Vehículo"}
              </Button>
            </div>
            
            {isAdding && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Añadir Nuevo Vehículo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="plateNumber">Matrícula</Label>
                      <Input
                        id="plateNumber"
                        name="plateNumber"
                        value={newVehicle.plateNumber}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="model">Modelo</Label>
                      <Input
                        id="model"
                        name="model"
                        value={newVehicle.model}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="capacity">Capacidad</Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        value={newVehicle.capacity}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="status">Estado</Label>
                      <select 
                        id="status"
                        name="status"
                        value={newVehicle.status}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="available">Disponible</option>
                        <option value="busy">Ocupado</option>
                        <option value="maintenance">En mantenimiento</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button onClick={handleAddVehicle} className="mt-4">
                    Guardar Vehículo
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Lista de Vehículos</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Capacidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">{vehicle.id}</TableCell>
                          <TableCell>{vehicle.plateNumber}</TableCell>
                          <TableCell>{vehicle.model}</TableCell>
                          <TableCell>{vehicle.capacity}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                              vehicle.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {vehicle.status === 'available' ? 'Disponible' :
                               vehicle.status === 'busy' ? 'Ocupado' :
                               'En mantenimiento'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteVehicle(vehicle.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No se encontraron vehículos
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AdminVehicles;
