
import { Navbar } from "@/components/Navbar";
import { RequireAuth } from "@/components/RequireAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { VehicleTrackingDashboard } from "@/components/admin/vehicles/VehicleTrackingDashboard";

const VehicleTracking = () => {
  return (
    <RequireAuth allowedRoles={["admin", "ambulance"]}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/vehiculos">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                  </Link>
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold">Seguimiento de Vehículos</h1>
              </div>
            </div>
            
            <VehicleTrackingDashboard />
          </div>
        </main>
      </div>
    </RequireAuth>
  );
};

export default VehicleTracking;
