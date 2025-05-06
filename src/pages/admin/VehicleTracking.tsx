
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { useVehicleTracking } from "@/hooks/useVehicleTracking";
import { VehicleTrackingHeader } from "@/components/admin/vehicles/tracking/VehicleTrackingHeader";
import { VehicleSidebar } from "@/components/admin/vehicles/tracking/VehicleSidebar";
import { VehicleMapArea } from "@/components/admin/vehicles/tracking/VehicleMapArea";

const VehicleTracking = () => {
  const {
    vehicles,
    loading,
    selectedVehicle,
    setSelectedVehicle,
    sidebarOpen,
    setSidebarOpen
  } = useVehicleTracking();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <RequireAuth allowedRoles={["admin", "ambulance"]}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        
        {/* Header with title */}
        <VehicleTrackingHeader 
          sidebarOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
        
        {/* Main content */}
        <main className="flex-grow flex overflow-hidden">
          {/* Sidebar */}
          <div 
            className={`${sidebarOpen ? 'w-full md:w-80' : 'w-0'} 
                      transition-all duration-300 bg-white border-r overflow-hidden
                      ${sidebarOpen ? 'md:flex' : 'md:hidden'} flex-col h-[calc(100vh-10rem)]`}
          >
            <VehicleSidebar
              vehicles={vehicles}
              loading={loading}
              selectedVehicle={selectedVehicle}
              setSelectedVehicle={setSelectedVehicle}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
          
          {/* Map area */}
          <VehicleMapArea 
            selectedVehicle={selectedVehicle}
            sidebarOpen={sidebarOpen}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
        </main>
      </div>
    </RequireAuth>
  );
};

export default VehicleTracking;
