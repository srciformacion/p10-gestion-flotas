
import { useState, useEffect, useCallback, useMemo } from "react";
import { ambulancesApi } from "@/services/api/ambulances";
import { Ambulance } from "@/types";
import { AmbulanceDetails } from "./AmbulanceDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { Ambulance as AmbulanceIcon } from "lucide-react";

interface VehicleInfoProps {
  vehicle: string;
  estimatedArrival?: string;
  formatDateTime: (date: string) => string;
}

export const VehicleInfo = React.memo(({ vehicle, estimatedArrival, formatDateTime }: VehicleInfoProps) => {
  const [ambulance, setAmbulance] = useState<Ambulance | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAmbulance = useCallback(async () => {
    if (!vehicle) {
      setLoading(false);
      return;
    }
    
    try {
      const data = await ambulancesApi.getById(vehicle);
      setAmbulance(data);
    } catch (error) {
      console.error("Error fetching ambulance:", error);
    } finally {
      setLoading(false);
    }
  }, [vehicle]);

  useEffect(() => {
    fetchAmbulance();
  }, [fetchAmbulance]);

  const formattedArrival = useMemo(() => {
    return estimatedArrival ? formatDateTime(estimatedArrival) : '';
  }, [estimatedArrival, formatDateTime]);

  if (loading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (!vehicle) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-500">Información del Vehículo</h3>
      
      {ambulance ? (
        <AmbulanceDetails ambulance={ambulance} />
      ) : (
        <div className="flex items-center space-x-2">
          <AmbulanceIcon className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium">{vehicle}</p>
            {estimatedArrival && (
              <p className="text-sm text-gray-500">
                Llegada estimada: {formattedArrival}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

VehicleInfo.displayName = "VehicleInfo";
