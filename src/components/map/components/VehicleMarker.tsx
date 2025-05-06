
import React from 'react';
import L from 'leaflet';
import { VehicleLocation, LocationAlert } from '@/types/location';

interface MarkerCreatorProps {
  vehicle: VehicleLocation;
  isHighlighted: boolean;
  vehicleAlerts: LocationAlert[];
  map: L.Map;
  markersRef: React.MutableRefObject<L.Layer[]>;
}

export const createVehicleMarker = ({
  vehicle,
  isHighlighted,
  vehicleAlerts,
  map,
  markersRef
}: MarkerCreatorProps) => {
  // Determine icon color based on status
  let iconColor = 'blue';
  if (vehicle.status === 'busy') iconColor = 'red';
  else if (vehicle.status === 'maintenance') iconColor = 'gray';

  // Create custom icon
  const icon = L.divIcon({
    html: `<div class="bg-${isHighlighted ? 'yellow' : iconColor}-600 p-2 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
           </div>`,
    className: `ambulance-marker ${isHighlighted ? 'highlighted' : ''}`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  // Create marker
  const marker = L.marker(
    [vehicle.location.latitude, vehicle.location.longitude],
    { icon }
  ).addTo(map);
  
  // Popup content
  const popupContent = `
    <div class="p-2">
      <h3 class="font-bold">${vehicle.id}</h3>
      <p>Matrícula: ${vehicle.licensePlate}</p>
      <p>Estado: ${vehicle.status === 'available' ? 'Disponible' : 
                  vehicle.status === 'busy' ? 'En servicio' : 'Mantenimiento'}</p>
      ${vehicle.estimatedArrival ? `<p>ETA: ${new Date(vehicle.estimatedArrival).toLocaleTimeString('es-ES')}</p>` : ''}
      <p>Velocidad: ${vehicle.location.speed ? Math.round(vehicle.location.speed) : 0} km/h</p>
    </div>
  `;
  
  marker.bindPopup(popupContent);
  markersRef.current.push(marker);
  
  // Add alert circle if there are alerts for this vehicle
  if (vehicleAlerts.length > 0) {
    const alertCircle = L.circle(
      [vehicle.location.latitude, vehicle.location.longitude],
      {
        color: '#ef4444',
        fillColor: '#ef4444',
        fillOpacity: 0.3,
        radius: 100,
        className: 'pulse-animation'
      }
    ).addTo(map);
    
    markersRef.current.push(alertCircle);
  }

  return marker;
};
