
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface VehicleTrackingHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const VehicleTrackingHeader = ({ 
  sidebarOpen, 
  toggleSidebar 
}: VehicleTrackingHeaderProps) => {
  return (
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
            onClick={toggleSidebar}
            className="md:hidden"
          >
            {sidebarOpen ? 'Ocultar Lista' : 'Mostrar Lista'}
          </Button>
        </div>
      </div>
    </div>
  );
};
