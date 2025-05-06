
import React from 'react';
import L from 'leaflet';
import { generateSimulatedCoordinates } from '../utils/mapHelpers';

interface DestinationMarkerProps {
  requestId: string;
  destination: string;
  map: L.Map;
  markersRef: React.MutableRefObject<L.Layer[]>;
}

export const createDestinationMarker = ({
  requestId,
  destination,
  map,
  markersRef
}: DestinationMarkerProps) => {
  // Generate coordinates from destination
  const destinationCoords = generateSimulatedCoordinates(destination);
  
  const destinationIcon = L.divIcon({
    html: `<div class="bg-purple-600 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
           </div>`,
    className: 'destination-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
  
  const marker = L.marker(
    [destinationCoords.lat, destinationCoords.lng],
    { icon: destinationIcon }
  ).addTo(map);
  
  marker.bindPopup(`<div class="p-2"><h3 class="font-bold">Destino</h3><p>${destination}</p></div>`);
  markersRef.current.push(marker);
  
  return {
    marker,
    coordinates: destinationCoords
  };
};
