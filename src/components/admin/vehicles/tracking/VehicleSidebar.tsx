
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleLocation } from "@/types/location";

interface VehicleSidebarProps {
  vehicles: VehicleLocation[];
  loading: boolean;
  selectedVehicle: string | undefined;
  setSelectedVehicle: (id: string | undefined) => void;
  onClose: () => void;
}

export const VehicleSidebar = ({ 
  vehicles, 
  loading, 
  selectedVehicle, 
  setSelectedVehicle,
  onClose
}: VehicleSidebarProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'busy':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'busy':
        return 'En servicio';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-medium">Ambulancias ({vehicles.length})</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle.id === selectedVehicle ? undefined : vehicle.id)}
                className={`w-full p-3 text-left rounded-lg border transition-all
                          ${vehicle.id === selectedVehicle 
                              ? 'border-[#368C45] bg-[#F2FCE2]' 
                              : 'hover:bg-gray-50 border-gray-200'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium">{vehicle.id}</div>
                  <Badge variant="outline" className={getStatusColor(vehicle.status)}>
                    {getStatusLabel(vehicle.status)}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  {vehicle.licensePlate}
                </div>
                {vehicle.estimatedArrival && (
                  <div className="text-xs text-gray-600 font-medium mt-1">
                    ETA: {new Date(vehicle.estimatedArrival).toLocaleTimeString('es-ES')}
                  </div>
                )}
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-[#368C45] border-[#368C45] hover:bg-[#F2FCE2]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVehicle(vehicle.id);
                    }}
                  >
                    Centrar en mapa
                  </Button>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
