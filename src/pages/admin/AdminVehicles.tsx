
import { useState, useCallback, useMemo, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { Ambulance } from "@/types";
import { ambulancesApi } from "@/services/api/ambulances";
import { ColumnDef } from "@tanstack/react-table";
import { AmbulanceDialog } from "@/components/admin/vehicles/AmbulanceDialog";
import { DeleteAmbulanceDialog } from "@/components/admin/vehicles/DeleteAmbulanceDialog";
import { emptyAmbulance } from "@/components/admin/vehicles/constants";

const AdminVehicles = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
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
    setIsSubmitting(true);
    try {
      let updatedAmbulance;
      
      if (isEditing && "id" in currentAmbulance) {
        updatedAmbulance = await ambulancesApi.update(
          currentAmbulance.id, 
          currentAmbulance
        );
        
        setAmbulances(prev => 
          prev.map(amb => amb.id === updatedAmbulance.id ? updatedAmbulance : amb)
        );
        
        toast.success("Ambulancia actualizada correctamente");
      } else {
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
            
            <AmbulanceDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              ambulance={currentAmbulance}
              isEditing={isEditing}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onFieldChange={handleChange}
              onEquipmentToggle={toggleEquipment}
            />
            
            <DeleteAmbulanceDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              onConfirm={handleDelete}
            />
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default AdminVehicles;
