
import { useState, useEffect } from "react";
import { locationService } from "@/services/api/locationService";
import { simulateGeocode, calculateDistance } from "../utils/locationUtils";
import { addMinutes, format } from "date-fns";

interface UseEtaCalculationProps {
  vehicleId: string;
  origin?: string;
  useGps: boolean;
}

interface VehicleInfo {
  vehicle: string;
  eta: string;
}

export function useEtaCalculation({ vehicleId, origin, useGps }: UseEtaCalculationProps) {
  const [estimatedEta, setEstimatedEta] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const updateEstimatedArrival = async () => {
      if (!vehicleId || !useGps || !origin) return;
      
      setIsCalculating(true);
      try {
        // In production, get real ETA based on routing API
        // Here we simulate a time based on distance
        const vehicleData = await locationService.getVehicleLocation(vehicleId);
        if (!vehicleData) return;
        
        const originCoords = simulateGeocode(origin);
        const distance = calculateDistance(
          originCoords.latitude,
          originCoords.longitude,
          vehicleData.location.latitude,
          vehicleData.location.longitude
        );
        
        // Simple estimation: 1 minute per km + base time of 5 minutes
        const estimatedMinutes = Math.round(distance + 5);
        const estimatedArrival = addMinutes(new Date(), estimatedMinutes);
        
        setEstimatedEta(format(estimatedArrival, "yyyy-MM-dd'T'HH:mm:ss"));
      } catch (error) {
        console.error("Error updating ETA:", error);
      } finally {
        setIsCalculating(false);
      }
    };
    
    if (origin) {
      updateEstimatedArrival();
    }
  }, [vehicleId, useGps, origin]);

  return { estimatedEta, isCalculating };
}
