
import React from "react";
import { Button } from "@/components/ui/button";
import { LiveMap } from "@/components/map/LiveMap";
import { LocationAlerts } from "@/components/map/LocationAlerts";

interface VehicleMapAreaProps {
  selectedVehicle: string | undefined;
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
}

export const VehicleMapArea = ({ 
  selectedVehicle, 
  sidebarOpen, 
  onOpenSidebar 
}: VehicleMapAreaProps) => {
  return (
    <div className="flex-grow flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex-grow relative">
        {!sidebarOpen && (
          <Button
            variant="default"
            size="sm"
            className="absolute left-4 top-4 z-10 bg-white text-gray-700 hover:bg-gray-100 shadow-md"
            onClick={onOpenSidebar}
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
  );
};
