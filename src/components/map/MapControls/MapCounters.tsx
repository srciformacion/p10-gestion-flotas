
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Truck, Bell } from "lucide-react";
import { LocationAlert } from '@/types/location';

interface MapCountersProps {
  vehiclesCount: number;
  alerts: LocationAlert[];
}

export const MapCounters: React.FC<MapCountersProps> = ({ vehiclesCount, alerts }) => {
  const activeAlerts = alerts.filter(a => !a.resolved);
  
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
      <Badge variant="outline" className="bg-white flex items-center gap-2">
        <Truck className="h-4 w-4" /> 
        <span>{vehiclesCount} vehículos</span>
      </Badge>
      {activeAlerts.length > 0 && (
        <Badge variant="destructive" className="flex items-center gap-2">
          <Bell className="h-4 w-4" /> 
          <span>{activeAlerts.length} alertas</span>
        </Badge>
      )}
    </div>
  );
};
