
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequests } from "@/context/requests";
import 'leaflet/dist/leaflet.css';

import { useMapData } from "./hooks/useMapData";
import { useLeafletMap } from "./hooks/useLeafletMap";
import { MapLegend } from "./components/MapLegend";
import { MapCounters } from "./components/MapCounters";
import { createVehicleMarker } from "./components/VehicleMarker";
import { createDestinationMarker } from "./components/DestinationMarker";

// CSS for the map
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px'
};

interface LiveMapProps {
  height?: string;
  showControls?: boolean;
  centerOnVehicle?: string;
  highlightRequest?: string;
}

export const LiveMap = ({ 
  height = "500px", 
  showControls = true,
  centerOnVehicle,
  highlightRequest
}: LiveMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { mapRef, markersRef } = useLeafletMap({ 
    containerRef: mapContainerRef, 
    showControls 
  });
  const { vehicles, alerts, loading } = useMapData();
  const { getRequestById } = useRequests();
  
  // Update markers when vehicles change
  useEffect(() => {
    if (!mapRef.current || vehicles.length === 0) return;

    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Center on a specific vehicle if requested
    if (centerOnVehicle) {
      const targetVehicle = vehicles.find(v => v.id === centerOnVehicle);
      if (targetVehicle && mapRef.current) {
        mapRef.current.setView(
          [targetVehicle.location.latitude, targetVehicle.location.longitude],
          15
        );
      }
    }

    // Add new markers for each vehicle
    vehicles.forEach(vehicle => {
      // Check if vehicle is assigned to the highlighted request
      const isHighlighted = highlightRequest && vehicle.assignedToRequestId === highlightRequest;
      
      // Get alerts for this vehicle
      const vehicleAlerts = alerts.filter(alert => 
        alert.vehicleId === vehicle.id && !alert.resolved
      );
      
      // Create marker
      createVehicleMarker({
        vehicle,
        isHighlighted,
        vehicleAlerts,
        map: mapRef.current!,
        markersRef
      });
    });

    // If there's a highlighted request but no vehicle assigned, show destination marker
    if (highlightRequest && !vehicles.some(v => v.assignedToRequestId === highlightRequest)) {
      const request = getRequestById(highlightRequest);
      if (request && mapRef.current) {
        // Create destination marker
        const { coordinates } = createDestinationMarker({
          requestId: highlightRequest,
          destination: request.destination,
          map: mapRef.current,
          markersRef
        });
        
        // Center and zoom map to show destination if not centered on vehicle
        if (!centerOnVehicle) {
          mapRef.current.setView([coordinates.lat, coordinates.lng], 14);
        }
      }
    }
  }, [vehicles, centerOnVehicle, highlightRequest, alerts, getRequestById]);

  return (
    <Card className="overflow-hidden">
      <div 
        style={{ 
          height, 
          position: 'relative',
          background: loading ? '#f3f4f6' : 'transparent'
        }}
      >
        {loading ? (
          <Skeleton className="w-full h-full absolute inset-0" />
        ) : (
          <>
            <div ref={mapContainerRef} style={mapContainerStyle} />
            
            {/* Legend */}
            {showControls && <MapLegend />}
            
            {/* Vehicle and alert counters */}
            {showControls && <MapCounters vehiclesCount={vehicles.length} alerts={alerts} />}
          </>
        )}
      </div>
    </Card>
  );
};

// Don't forget to import useEffect
import { useEffect } from "react";
