
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { VehicleLocation, LocationAlert } from "@/types/location";
import { locationService } from "@/services/api/location"; // Updated import path
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Truck, Bell, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRequests } from "@/context/RequestsContext";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// CSS para el mapa
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
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [alerts, setAlerts] = useState<LocationAlert[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Layer[]>([]);
  const { toast } = useToast();
  const { getRequestById } = useRequests();
  
  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Crear el mapa si aún no existe
    if (!mapRef.current) {
      // Centro inicial en Logroño, La Rioja, España
      mapRef.current = L.map(mapContainerRef.current).setView([42.4627, -2.4450], 14);
      
      // Añadir capa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Añadir controles de zoom
      if (showControls) {
        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      }
    }

    // Limpiar marcadores anteriores al recargar
    return () => {
      if (markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (mapRef.current) marker.remove();
        });
        markersRef.current = [];
      }
    };
  }, [showControls]);

  // Obtener ubicaciones de vehículos
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const locations = await locationService.getVehicleLocations();
        setVehicles(locations);
        
        // Obtener alertas activas
        const activeAlerts = await locationService.getAlerts(false);
        setAlerts(activeAlerts);
        
        // Notificar nuevas alertas
        if (activeAlerts.length > 0) {
          const newAlerts = activeAlerts.filter(alert => {
            // Considerar alerta nueva si fue creada en los últimos 10 segundos
            const alertTime = new Date(alert.timestamp).getTime();
            const tenSecondsAgo = Date.now() - 10000;
            return alertTime > tenSecondsAgo;
          });
          
          newAlerts.forEach(alert => {
            const requestId = alert.requestId;
            const request = getRequestById(requestId);
            const patientName = request ? request.patientName : requestId;
            
            toast({
              title: `Alerta: ${alert.type === 'delay' ? 'Retraso' : 
                      alert.type === 'detour' ? 'Desvío' : 'Parada no programada'}`,
              description: `${alert.details} para el paciente ${patientName}`,
              variant: "destructive"
            });
          });
        }
      } catch (error) {
        console.error("Error fetching vehicle locations:", error);
      } finally {
        setLoading(false);
      }
    };

    // Obtener datos iniciales
    fetchLocations();

    // Configurar intervalo de actualización
    const interval = setInterval(fetchLocations, 10000);
    return () => clearInterval(interval);
  }, [getRequestById, toast]);

  // Actualizar marcadores cuando cambian los vehículos
  useEffect(() => {
    if (!mapRef.current || vehicles.length === 0) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Centrar en un vehículo específico si se solicita
    if (centerOnVehicle) {
      const targetVehicle = vehicles.find(v => v.id === centerOnVehicle);
      if (targetVehicle) {
        mapRef.current.setView(
          [targetVehicle.location.latitude, targetVehicle.location.longitude],
          15
        );
      }
    }

    // Añadir nuevos marcadores para cada vehículo
    vehicles.forEach(vehicle => {
      // Determinar el icono según el estado
      let iconColor = 'blue';
      if (vehicle.status === 'busy') iconColor = 'red';
      else if (vehicle.status === 'maintenance') iconColor = 'gray';

      // Resaltar el vehículo si está asignado a la solicitud destacada
      const isHighlighted = highlightRequest && vehicle.assignedToRequestId === highlightRequest;
      
      // Crear icono personalizado
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

      // Crear marcador
      const marker = L.marker(
        [vehicle.location.latitude, vehicle.location.longitude],
        { icon }
      ).addTo(mapRef.current!);
      
      // Ventana emergente con información
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
      
      // Añadir alertas al mapa
      const vehicleAlerts = alerts.filter(alert => alert.vehicleId === vehicle.id && !alert.resolved);
      
      if (vehicleAlerts.length > 0) {
        // Crear círculo pulsante alrededor del marcador para indicar alerta
        const alertCircle = L.circle(
          [vehicle.location.latitude, vehicle.location.longitude],
          {
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.3,
            radius: 100,
            className: 'pulse-animation'
          }
        ).addTo(mapRef.current!);
        
        markersRef.current.push(alertCircle);
      }
    });

    // Si hay solicitud destacada pero no hay vehículo asignado, mostrar marcador de destino
    if (highlightRequest && !vehicles.some(v => v.assignedToRequestId === highlightRequest)) {
      const request = getRequestById(highlightRequest);
      if (request) {
        // Usar geocodificación simple para simular coordenadas del destino
        // En producción, usar un servicio real de geocodificación
        const destinationCoords = generateSimulatedCoordinates(request.destination);
        
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
        ).addTo(mapRef.current!);
        
        marker.bindPopup(`<div class="p-2"><h3 class="font-bold">Destino</h3><p>${request.destination}</p></div>`);
        markersRef.current.push(marker);
        
        // Centrar y ajustar el mapa para mostrar el destino
        if (!centerOnVehicle) {
          mapRef.current.setView([destinationCoords.lat, destinationCoords.lng], 14);
        }
      }
    }
  }, [vehicles, centerOnVehicle, highlightRequest, alerts, getRequestById]);

  // Función auxiliar para generar coordenadas simuladas basadas en una dirección
  // En producción, se usaría un servicio real de geocodificación
  function generateSimulatedCoordinates(address: string): {lat: number, lng: number} {
    // Base: coordenadas de Logroño
    const baseLat = 42.4627;
    const baseLng = -2.4450;
    
    // Generar variación basada en un hash simple de la dirección
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      hash = ((hash << 5) - hash) + address.charCodeAt(i);
      hash |= 0;
    }
    
    // Usar el hash para generar una variación pequeña pero consistente
    const latVariation = (hash % 100) / 1000; // ±0.1 aprox
    const lngVariation = ((hash / 100) % 100) / 1000;
    
    return {
      lat: baseLat + latVariation,
      lng: baseLng + lngVariation
    };
  }

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
            
            {/* Leyenda */}
            {showControls && (
              <div className="absolute bottom-4 left-4 bg-white p-2 rounded-md shadow-md z-[1000]">
                <div className="text-sm font-medium mb-1">Estado de vehículos:</div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-xs">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    <span className="text-xs">En servicio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                    <span className="text-xs">Mantenimiento</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contador de vehículos y alertas */}
            {showControls && (
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
                <Badge variant="outline" className="bg-white flex items-center gap-2">
                  <Truck className="h-4 w-4" /> 
                  <span>{vehicles.length} vehículos</span>
                </Badge>
                {alerts.filter(a => !a.resolved).length > 0 && (
                  <Badge variant="destructive" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" /> 
                    <span>{alerts.filter(a => !a.resolved).length} alertas</span>
                  </Badge>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
