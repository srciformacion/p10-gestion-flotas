
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
      // Initial center in Logroño, La Rioja, Spain
      mapRef.current = L.map(containerRef.current).setView([42.4627, -2.4450], 14);
      
      // Add OpenStreetMap layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Add zoom controls
      if (showControls) {
        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      }
    }

    // Clean up previous markers on reload
    return () => {
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (mapRef.current) marker.remove();
        });
        markersRef.current = [];
      }
    };
  }, [containerRef, showControls]);

  return { mapRef, markersRef };
};
