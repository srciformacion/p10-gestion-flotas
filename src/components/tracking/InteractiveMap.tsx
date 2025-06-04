
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { AmbulanceStatus } from '@/types/ambulance';

interface AmbulanceLocation {
  id: string;
  vehicleId: string;
  lat: number;
  lng: number;
  status: AmbulanceStatus;
  address: string;
  speed?: number;
  heading?: number;
  lastUpdate: string;
}

interface InteractiveMapProps {
  ambulances: AmbulanceLocation[];
  onAmbulanceSelect?: (ambulanceId: string) => void;
}

// Colores por estado
const getStatusColor = (status: AmbulanceStatus) => {
  switch (status) {
    case 'available': return '#10b981'; // verde
    case 'busy': return '#f59e0b'; // amarillo
    case 'maintenance': return '#8b5cf6'; // morado
    case 'offline': return '#6b7280'; // gris
    default: return '#6b7280';
  }
};

// Crear icono personalizado para cada ambulancia
const createCustomIcon = (status: AmbulanceStatus) => {
  const color = getStatusColor(status);
  
  return L.divIcon({
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ${status === 'maintenance' ? 'animation: pulse 2s infinite;' : ''}
      ">
        🚑
      </div>
      <style>
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }
      </style>
    `,
    className: 'custom-ambulance-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  ambulances, 
  onAmbulanceSelect 
}) => {
  // Centro del mapa en La Rioja, España
  const laRiojaCenter: [number, number] = [42.4627, -2.4449];

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={laRiojaCenter}
        zoom={10}
        className="absolute inset-0 rounded-lg"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {ambulances.map((ambulance) => (
          <Marker
            key={ambulance.id}
            position={[ambulance.lat, ambulance.lng]}
            icon={createCustomIcon(ambulance.status)}
            eventHandlers={{
              click: () => {
                if (onAmbulanceSelect) {
                  onAmbulanceSelect(ambulance.id);
                }
              },
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm">{ambulance.vehicleId}</h3>
                <p className="text-xs text-gray-600">{ambulance.address}</p>
                <p className="text-xs">
                  Estado: <span 
                    className="font-semibold" 
                    style={{ color: getStatusColor(ambulance.status) }}
                  >
                    {ambulance.status}
                  </span>
                </p>
                {ambulance.speed && (
                  <p className="text-xs">Velocidad: {ambulance.speed} km/h</p>
                )}
                <p className="text-xs text-gray-500">
                  Actualizado: {new Date(ambulance.lastUpdate).toLocaleTimeString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Leyenda */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="text-sm font-semibold mb-2">Estados</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Ocupada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Mantenimiento</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Desconectada</span>
          </div>
        </div>
      </div>

      {/* Info de ambulancias */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-blue-500" />
          <span className="font-semibold">{ambulances.length}</span>
          <span>ambulancia{ambulances.length !== 1 ? 's' : ''} activa{ambulances.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};
