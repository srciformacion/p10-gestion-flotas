
import { useState, useEffect } from "react";
import { VehicleLocation } from "@/types/location";
import { locationService } from "@/services/api/locationService";

export const useVehicleTracking = () => {
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

  return {
    vehicles,
    loading,
    selectedVehicle,
    setSelectedVehicle,
    sidebarOpen,
    setSidebarOpen
  };
};
