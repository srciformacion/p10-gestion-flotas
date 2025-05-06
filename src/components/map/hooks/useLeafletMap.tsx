
import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface UseLeafletMapProps {
  containerRef: React.RefObject<HTMLDivElement>;
  showControls?: boolean;
}

export const useLeafletMap = ({ containerRef, showControls = true }: UseLeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Layer[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create map if it doesn't exist yet
    if (!mapRef.current) {
      console.log("useLeafletMap: Creando nuevo mapa");
      try {
        // Initial center in Spain
        mapRef.current = L.map(containerRef.current, {
          center: [40.4168, -3.7038],
          zoom: 6,
          zoomControl: showControls
        });
        
        // Add OpenStreetMap layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        // Add zoom controls if needed
        if (showControls) {
          L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
        }
        
        console.log("useLeafletMap: Mapa creado exitosamente");
      } catch (error) {
        console.error("Error creando mapa:", error);
      }
    }

    // Ensure map is responsive to container size changes
    const handleResize = () => {
      if (mapRef.current) {
        console.log("useLeafletMap: Recalculando tamaño del mapa");
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up previous markers on reload
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (markersRef.current.length > 0) {
        console.log("useLeafletMap: Limpiando marcadores antiguos");
        markersRef.current.forEach(marker => {
          if (mapRef.current) marker.remove();
        });
        markersRef.current = [];
      }
    };
  }, [containerRef, showControls]);

  return { mapRef, markersRef };
};
