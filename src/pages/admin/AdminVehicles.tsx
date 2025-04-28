
import { useState, useCallback, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, Edit, Trash, Search } from "lucide-react";
import { toast } from "sonner";
import { Ambulance } from "@/types";
import { ambulancesApi } from "@/services/api/ambulances";
import { ColumnDef } from "@tanstack/react-table";

const equipmentOptions = [
  { id: "stair-chair", label: "Silla oruga" },
  { id: "bariatric-bed", label: "Camilla bariátrica" },
  { id: "bariatric-equipment", label: "Equipamiento para pacientes bariátricos" },
  { id: "vital-signs", label: "Monitorización de constantes vitales" },
  { id: "oxygen", label: "Oxígeno" },
  { id: "defibrillator", label: "Desfibrilador" }
];

const emptyAmbulance: Omit<Ambulance, "id"> = {
  licensePlate: "",
  model: "",
  type: "consultation",
  baseLocation: "",
  hasMedicalBed: false,
  hasWheelchair: false,
  allowsWalking: false,
  stretcherSeats: 0,
  wheelchairSeats: 0,
  walkingSeats: 0,
  equipment: [],
  zone: "",
  status: "available",
  notes: ""
};

const AdminVehicles = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAmbulance, setCurrentAmbulance] = useState<Omit<Ambulance, "id"> | Ambulance>(emptyAmbulance);
  
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ambulanceToDelete, setAmbulanceToDelete] = useState<string | null>(null);
  
  // Load ambulances on component mount
  useEffect(() => {
    const loadAmbulances = async () => {
      try {
        const data = await ambulancesApi.getAll();
        setAmbulances(data);
      } catch (error) {
        toast.error("Error al cargar las ambulancias");
        console.error("Error loading ambulances:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAmbulances();
  }, []);

  // Handler for form input changes
  const handleChange = useCallback((field: keyof Ambulance, value: any) => {
    setCurrentAmbulance(prev => ({ ...prev, [field]: value }));
  }, []);
  
  // Toggle equipment selection
  const toggleEquipment = useCallback((equipmentId: string) => {
    setCurrentAmbulance(prev => {
      const currentEquipment = prev.equipment || [];
      if (currentEquipment.includes(equipmentId)) {
        return {
          ...prev,
          equipment: currentEquipment.filter(id => id !== equipmentId)
        };
      } else {
        return {
          ...prev,
          equipment: [...currentEquipment, equipmentId]
        };
      }
    });
  }, []);

  // Open edit dialog with ambulance data
  const handleEditClick = useCallback((ambulance: Ambulance) => {
    setCurrentAmbulance(ambulance);
    setIsEditing(true);
    setDialogOpen(true);
  }, []);
  
  // Open delete confirmation dialog
  const handleDeleteClick = useCallback((id: string) => {
    setAmbulanceToDelete(id);
    setDeleteDialogOpen(true);
  }, []);
  
  // Open dialog for adding new ambulance
  const handleAddNewClick = useCallback(() => {
    setCurrentAmbulance(emptyAmbulance);
    setIsEditing(false);
    setDialogOpen(true);
  }, []);
  
  // Submit handler for adding/editing ambulance
  const handleSubmit = useCallback(async () => {
    if (!currentAmbulance.licensePlate || 
        !currentAmbulance.model || 
        !currentAmbulance.baseLocation) {
      toast.error("Por favor, complete los campos obligatorios");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let updatedAmbulance;
      
      if (isEditing && "id" in currentAmbulance) {
        // Editing existing ambulance
        updatedAmbulance = await ambulancesApi.update(
          currentAmbulance.id, 
          currentAmbulance
        );
        
        setAmbulances(prev => 
          prev.map(amb => amb.id === updatedAmbulance.id ? updatedAmbulance : amb)
        );
        
        toast.success("Ambulancia actualizada correctamente");
      } else {
        // Adding new ambulance
        updatedAmbulance = await ambulancesApi.create(currentAmbulance);
        setAmbulances(prev => [...prev, updatedAmbulance]);
        toast.success("Ambulancia añadida correctamente");
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast.error(isEditing ? "Error al actualizar la ambulancia" : "Error al añadir la ambulancia");
      console.error("Error saving ambulance:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentAmbulance, isEditing]);
  
  // Delete ambulance handler
  const handleDelete = useCallback(async () => {
    if (!ambulanceToDelete) return;
    
    try {
      await ambulancesApi.delete(ambulanceToDelete);
      setAmbulances(prev => prev.filter(amb => amb.id !== ambulanceToDelete));
      toast.success("Ambulancia eliminada correctamente");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Error al eliminar la ambulancia");
      console.error("Error deleting ambulance:", error);
    }
  }, [ambulanceToDelete]);
  
  // Table columns definition
  const columns: ColumnDef<Ambulance>[] = useMemo(() => [
    {
      accessorKey: "id",
      header: "Identificador",
    },
    {
      accessorKey: "licensePlate",
      header: "Matrícula",
    },
    {
      accessorKey: "model",
      header: "Modelo",
    },
    {
      accessorKey: "baseLocation",
      header: "Ubicación base",
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => {
        const status = row.getValue("status") as Ambulance["status"];
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === 'available' ? 'bg-green-100 text-green-800' :
            status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {status === 'available' ? 'Disponible' :
             status === 'busy' ? 'Asignada' :
             'En mantenimiento'}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => handleEditClick(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleDeleteClick(row.original.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], [handleEditClick, handleDeleteClick]);

  return (
    <RequireAuth allowedRoles={["admin"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl md:text-3xl font-bold">Gestión de Ambulancias</h1>
              <Button onClick={handleAddNewClick}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Ambulancia
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Lista de Ambulancias</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Cargando ambulancias...</div>
                ) : (
                  <DataTable 
                    columns={columns} 
                    data={ambulances} 
                    searchColumn="id"
                    searchPlaceholder="Buscar por ID, matrícula..."
                  />
                )}
              </CardContent>
            </Card>
            
            {/* Add/Edit Ambulance Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Editar Ambulancia" : "Añadir Nueva Ambulancia"}
                  </DialogTitle>
                  <DialogDescription>
                    Complete todos los campos obligatorios para {isEditing ? "actualizar" : "añadir"} la ambulancia.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">
                      Identificador {isEditing && "(no modificable)"}
                    </Label>
                    <Input
                      id="id"
                      placeholder="Ej: A-101, SVB-Logroño-1"
                      value={isEditing && "id" in currentAmbulance ? currentAmbulance.id : "Se generará automáticamente"}
                      disabled={true}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate" className="required">Matrícula</Label>
                    <Input
                      id="licensePlate"
                      placeholder="Ej: 1234ABC"
                      value={currentAmbulance.licensePlate}
                      onChange={(e) => handleChange("licensePlate", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="model" className="required">Modelo</Label>
                    <Input
                      id="model"
                      placeholder="Ej: Mercedes Sprinter"
                      value={currentAmbulance.model}
                      onChange={(e) => handleChange("model", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type" className="required">Tipo</Label>
                    <Select
                      value={currentAmbulance.type}
                      onValueChange={(value) => handleChange("type", value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Transporte programado</SelectItem>
                        <SelectItem value="emergency">Emergencias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="baseLocation" className="required">Ubicación Base</Label>
                    <Input
                      id="baseLocation"
                      placeholder="Ej: Logroño, Calahorra"
                      value={currentAmbulance.baseLocation}
                      onChange={(e) => handleChange("baseLocation", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zone" className="required">Zona de operación</Label>
                    <Input
                      id="zone"
                      placeholder="Ej: Logroño, Haro"
                      value={currentAmbulance.zone}
                      onChange={(e) => handleChange("zone", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status" className="required">Estado</Label>
                    <Select
                      value={currentAmbulance.status}
                      onValueChange={(value) => 
                        handleChange("status", value as Ambulance['status'])
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Disponible</SelectItem>
                        <SelectItem value="busy">Asignada a servicio</SelectItem>
                        <SelectItem value="maintenance">En mantenimiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="required">Disponibilidad</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hasMedicalBed" 
                          checked={currentAmbulance.hasMedicalBed} 
                          onCheckedChange={(checked) => 
                            handleChange("hasMedicalBed", Boolean(checked))
                          }
                        />
                        <label htmlFor="hasMedicalBed">
                          Tiene camilla
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="hasWheelchair" 
                          checked={currentAmbulance.hasWheelchair} 
                          onCheckedChange={(checked) => 
                            handleChange("hasWheelchair", Boolean(checked))
                          }
                        />
                        <label htmlFor="hasWheelchair">
                          Tiene silla de ruedas
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="allowsWalking" 
                          checked={currentAmbulance.allowsWalking} 
                          onCheckedChange={(checked) => 
                            handleChange("allowsWalking", Boolean(checked))
                          }
                        />
                        <label htmlFor="allowsWalking">
                          Permite transporte andando/sentado
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="required">Capacidad máxima</Label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <label htmlFor="stretcherSeats" className="w-full">
                            Pacientes en camilla:
                          </label>
                          <Input
                            id="stretcherSeats"
                            type="number"
                            min="0"
                            value={currentAmbulance.stretcherSeats}
                            onChange={(e) => handleChange("stretcherSeats", parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </div>
                        <div className="flex items-center">
                          <label htmlFor="wheelchairSeats" className="w-full">
                            Pacientes en silla:
                          </label>
                          <Input
                            id="wheelchairSeats"
                            type="number"
                            min="0"
                            value={currentAmbulance.wheelchairSeats}
                            onChange={(e) => handleChange("wheelchairSeats", parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </div>
                        <div className="flex items-center">
                          <label htmlFor="walkingSeats" className="w-full">
                            Pacientes andando:
                          </label>
                          <Input
                            id="walkingSeats"
                            type="number"
                            min="0"
                            value={currentAmbulance.walkingSeats}
                            onChange={(e) => handleChange("walkingSeats", parseInt(e.target.value) || 0)}
                            className="w-20"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Equipamiento especial</Label>
                      <div className="space-y-2">
                        {equipmentOptions.map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`equipment-${item.id}`}
                              checked={currentAmbulance.equipment?.includes(item.id)}
                              onCheckedChange={() => toggleEquipment(item.id)}
                            />
                            <label htmlFor={`equipment-${item.id}`}>
                              {item.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label htmlFor="notes">Notas internas</Label>
                    <Textarea
                      id="notes"
                      placeholder="Observaciones administrativas (opcional)"
                      value={currentAmbulance.notes || ""}
                      onChange={(e) => handleChange("notes", e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : isEditing ? "Actualizar" : "Guardar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar eliminación</DialogTitle>
                  <DialogDescription>
                    ¿Está seguro de que desea eliminar esta ambulancia? Esta acción no se puede deshacer.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Eliminar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AdminVehicles;
