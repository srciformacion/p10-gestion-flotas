
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Settings } from 'lucide-react';

interface AmbulanceLocation {
  id: string;
  vehicleId: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'emergency' | 'offline';
  address: string;
  speed?: number;
  heading?: number;
  lastUpdate: string;
}

interface InteractiveMapProps {
  ambulances: AmbulanceLocation[];
  onAmbulanceSelect?: (ambulanceId: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  ambulances, 
  onAmbulanceSelect 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Colores por estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981'; // verde
      case 'busy': return '#f59e0b'; // amarillo
      case 'emergency': return '#ef4444'; // rojo
      case 'offline': return '#6b7280'; // gris
      default: return '#6b7280';
    }
  };

  // Crear marcador personalizado
  const createMarkerElement = (ambulance: AmbulanceLocation) => {
    const el = document.createElement('div');
    el.className = 'ambulance-marker';
    el.style.cssText = `
      width: 32px;
      height: 32px;
      background-color: ${getStatusColor(ambulance.status)};
      border: 3px solid white;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      position: relative;
    `;
    el.innerHTML = '🚑';
    
    // Añadir pulso para ambulancias en emergencia
    if (ambulance.status === 'emergency') {
      el.style.animation = 'pulse 2s infinite';
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `;
      document.head.appendChild(style);
    }

    return el;
  };

  // Inicializar mapa
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-3.7038, 40.4168], // Madrid como centro por defecto
      zoom: 11
    });

    // Añadir controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Añadir control de geolocalización
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'top-right'
    );

    setShowTokenInput(false);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Actualizar marcadores cuando cambien las ambulancias
  useEffect(() => {
    if (!map.current) return;

    // Limpiar marcadores existentes
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Añadir nuevos marcadores
    ambulances.forEach(ambulance => {
      const el = createMarkerElement(ambulance);
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([ambulance.lng, ambulance.lat])
        .addTo(map.current!);

      // Crear popup con información
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold text-sm">${ambulance.vehicleId}</h3>
          <p class="text-xs text-gray-600">${ambulance.address}</p>
          <p class="text-xs">Estado: <span class="font-semibold" style="color: ${getStatusColor(ambulance.status)}">${ambulance.status}</span></p>
          ${ambulance.speed ? `<p class="text-xs">Velocidad: ${ambulance.speed} km/h</p>` : ''}
          <p class="text-xs text-gray-500">Actualizado: ${new Date(ambulance.lastUpdate).toLocaleTimeString()}</p>
        </div>
      `);

      // Eventos del marcador
      el.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
        marker.setPopup(popup);
      });

      el.addEventListener('mouseleave', () => {
        popup.remove();
      });

      el.addEventListener('click', () => {
        if (onAmbulanceSelect) {
          onAmbulanceSelect(ambulance.id);
        }
        // Centrar mapa en la ambulancia
        map.current!.flyTo({
          center: [ambulance.lng, ambulance.lat],
          zoom: 15,
          duration: 1000
        });
      });

      markers.current[ambulance.id] = marker;
    });

    // Ajustar vista para mostrar todas las ambulancias
    if (ambulances.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      ambulances.forEach(ambulance => {
        bounds.extend([ambulance.lng, ambulance.lat]);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15
      });
    }
  }, [ambulances, onAmbulanceSelect]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
    }
  };

  if (showTokenInput) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Mapa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Para mostrar el mapa interactivo, necesitas proporcionar tu token público de Mapbox.
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ingresa tu token público de Mapbox..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
                Configurar
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Puedes obtener tu token en{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {/* Leyenda */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
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
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Emergencia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Desconectada</span>
          </div>
        </div>
      </div>

      {/* Info de ambulancias */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-blue-500" />
          <span className="font-semibold">{ambulances.length}</span>
          <span>ambulancia{ambulances.length !== 1 ? 's' : ''} activa{ambulances.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};
