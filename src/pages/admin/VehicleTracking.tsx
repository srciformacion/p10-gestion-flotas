
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { LiveMap } from "@/components/map/LiveMap";
import { LocationAlerts } from "@/components/map/LocationAlerts";
import { locationService } from "@/services/api/locationService";
import { VehicleLocation } from "@/types/location";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const VehicleTracking = () => {
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await locationService.getVehicleLocations();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
    const interval = setInterval(fetchVehicles, 15000);
    return () => clearInterval(interval);
  }, []);

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
    <RequireAuth allowedRoles={["admin", "ambulance"]}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        
        {/* Header with title */}
        <div className="bg-white border-b py-3 px-4 md:px-6 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/vehiculos">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                </Link>
              </Button>
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#368C45]" /> 
                Localización en Tiempo Real
              </h1>
            </div>
            
            <div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                {sidebarOpen ? 'Ocultar Lista' : 'Mostrar Lista'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-grow flex overflow-hidden">
          {/* Sidebar */}
          <div 
            className={`${sidebarOpen ? 'w-full md:w-80' : 'w-0'} 
                      transition-all duration-300 bg-white border-r overflow-hidden
                      ${sidebarOpen ? 'md:flex' : 'md:hidden'} flex-col h-[calc(100vh-10rem)]`}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-medium">Ambulancias ({vehicles.length})</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(false)}
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
          
          {/* Map area */}
          <div className="flex-grow flex flex-col h-[calc(100vh-10rem)]">
            <div className="flex-grow relative">
              {!sidebarOpen && (
                <Button
                  variant="default"
                  size="sm"
                  className="absolute left-4 top-4 z-10 bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                  onClick={() => setSidebarOpen(true)}
                >
                  Ver Ambulancias
                </Button>
              )}
              <LiveMap 
                height="100%" 
                centerOnVehicle={selectedVehicle}
                showControls={true}
              />
            </div>
            
            {/* Alerts footer */}
            <div className="h-32 bg-white border-t overflow-hidden">
              <LocationAlerts />
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default VehicleTracking;
