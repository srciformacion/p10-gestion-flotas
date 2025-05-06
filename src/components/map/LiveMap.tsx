
import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequests } from "@/context/requests";
import 'leaflet/dist/leaflet.css';

import { useMapData } from "./hooks/useMapData";
import { useLeafletMap } from "./hooks/useLeafletMap";
import { MapLegend, MapCounters } from "./MapControls";
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
  const [mapInitialized, setMapInitialized] = useState(false);
  
  // Initialize map when component mounts
  useEffect(() => {
    if (mapContainerRef.current && mapRef.current && !mapInitialized) {
      console.log("LiveMap: Inicializando mapa");
      // Force map to recalculate its size after component is fully rendered
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
          setMapInitialized(true);
          console.log("LiveMap: Mapa invalidado y recalculado");
        }
      }, 200);
    }
  }, [mapRef.current, mapContainerRef.current, mapInitialized]);

  // Update markers when vehicles change
  useEffect(() => {
    if (!mapRef.current) {
      console.log("LiveMap: mapRef no disponible aún");
      return;
    }
    
    console.log("LiveMap: Actualizando marcadores", { 
      vehiclesCount: vehicles.length,
      mapInitialized,
      highlightRequest 
    });

    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Center on a specific vehicle if requested
    if (centerOnVehicle) {
      const targetVehicle = vehicles.find(v => v.id === centerOnVehicle);
      if (targetVehicle && mapRef.current) {
        console.log("LiveMap: Centrando en vehículo específico", targetVehicle);
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
      
      console.log("LiveMap: Creando marcador para vehículo", { 
        vehicleId: vehicle.id,
        isHighlighted,
        position: [vehicle.location.latitude, vehicle.location.longitude]
      });
      
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
        console.log("LiveMap: Creando marcador para destino de solicitud", {
          requestId: highlightRequest,
          destination: request.destination
        });
        
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
    
    // If no specific center was requested, but we have vehicles, center the map to show all vehicles
    if (!centerOnVehicle && !highlightRequest && vehicles.length > 0 && mapRef.current) {
      // Default to Madrid if no vehicles
      let defaultView = { lat: 40.4168, lng: -3.7038, zoom: 12 };
      
      if (vehicles.length === 1) {
        // Center on the single vehicle
        defaultView = {
          lat: vehicles[0].location.latitude,
          lng: vehicles[0].location.longitude,
          zoom: 14
        };
      } else if (vehicles.length > 1) {
        // Center to fit all vehicles
        mapRef.current.setView([defaultView.lat, defaultView.lng], 10);
        
        const bounds = vehicles.reduce((bounds, vehicle) => {
          bounds.extend([vehicle.location.latitude, vehicle.location.longitude]);
          return bounds;
        }, L.latLngBounds([]));
        
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { padding: [50, 50] });
          return; // Skip the setView below since we used fitBounds
        }
      }
      
      mapRef.current.setView([defaultView.lat, defaultView.lng], defaultView.zoom);
    }
  }, [vehicles, centerOnVehicle, highlightRequest, alerts, getRequestById, mapInitialized]);

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
            <div ref={mapContainerRef} style={mapContainerStyle} className="leaflet-container" />
            
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
