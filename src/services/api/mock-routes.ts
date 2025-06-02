
import { RoutePoint, Route } from '@/types/route';

// Ubicaciones específicas de La Rioja con coordenadas reales
const riojaLocations = [
  { name: 'Hospital San Pedro - Logroño', lat: 42.4627, lng: -2.4449, address: 'Calle Piqueras 98, 26006 Logroño' },
  { name: 'Hospital de la Rioja - Logroño', lat: 42.4721, lng: -2.4312, address: 'Calle San Millán 1, 26004 Logroño' },
  { name: 'Centro de Salud Cascajos - Logroño', lat: 42.4455, lng: -2.4612, address: 'Calle Hermanos Moroy 2, 26005 Logroño' },
  { name: 'Centro de Salud Espartero - Logroño', lat: 42.4608, lng: -2.4493, address: 'Calle Pérez Galdós 2, 26003 Logroño' },
  { name: 'Hospital de Calahorra', lat: 42.3050, lng: -1.9653, address: 'Carretera de Logroño s/n, 26500 Calahorra' },
  { name: 'Centro de Salud Calahorra', lat: 42.3023, lng: -1.9679, address: 'Avenida Numancia 37, 26500 Calahorra' },
  { name: 'Hospital de Haro', lat: 42.5841, lng: -2.8453, address: 'Calle Los Agustinos s/n, 26200 Haro' },
  { name: 'Centro de Salud Haro', lat: 42.5863, lng: -2.8497, address: 'Plaza de la Cruz 2, 26200 Haro' },
  { name: 'Centro de Salud Santo Domingo', lat: 42.4386, lng: -2.9521, address: 'Plaza del Salvador 4, 26250 Santo Domingo de la Calzada' },
  { name: 'Centro de Salud Nájera', lat: 42.4168, lng: -2.7340, address: 'Calle Costanilla 15, 26300 Nájera' },
  { name: 'Centro de Salud Alfaro', lat: 42.1766, lng: -1.7549, address: 'Calle Estambrera 28, 26540 Alfaro' },
  { name: 'Residencia Los Royales - Logroño', lat: 42.4598, lng: -2.4387, address: 'Calle Los Royales 15, 26003 Logroño' },
  { name: 'Domicilio - Calle Bretón de los Herreros', lat: 42.4640, lng: -2.4420, address: 'Calle Bretón de los Herreros 25, 26001 Logroño' },
  { name: 'Domicilio - Avenida de la Paz', lat: 42.4712, lng: -2.4355, address: 'Avenida de la Paz 45, 26004 Logroño' },
  { name: 'Domicilio - Calle Mayor Haro', lat: 42.5855, lng: -2.8501, address: 'Calle Mayor 15, 26200 Haro' },
  { name: 'Clínica Vistahermosa - Logroño', lat: 42.4583, lng: -2.4401, address: 'Calle Hermanos Hircio 1, 26001 Logroño' }
];

// Tipos de servicio para generar variedad
const serviceTypes = [
  { type: 'consulta', priority: 'medium', transportType: 'walking' as const },
  { type: 'urgencia', priority: 'high', transportType: 'stretcher' as const },
  { type: 'dialisis', priority: 'medium', transportType: 'wheelchair' as const },
  { type: 'oncologia', priority: 'high', transportType: 'stretcher' as const },
  { type: 'rehabilitacion', priority: 'low', transportType: 'walking' as const },
  { type: 'emergencia', priority: 'emergency', transportType: 'stretcher' as const }
];

// Nombres de pacientes
const patientNames = [
  'María García López', 'Juan Martínez Ruiz', 'Ana Rodríguez Pérez', 'Carlos López Fernández',
  'Isabel Gómez Torres', 'Miguel Sánchez Díaz', 'Carmen Ruiz Moreno', 'Francisco Torres Gil',
  'Laura Jiménez Vega', 'Antonio Morales Castro', 'Elena Vargas Herrera', 'José Ramírez Ortega'
];

// Generar servicios para una ruta
const generateServices = (routeId: string, numServices: number) => {
  const services = [];
  const today = new Date();
  
  for (let i = 0; i < numServices; i++) {
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const origin = riojaLocations[Math.floor(Math.random() * riojaLocations.length)];
    const destination = riojaLocations[Math.floor(Math.random() * riojaLocations.length)];
    
    // Asegurar que origen y destino sean diferentes
    while (destination.name === origin.name) {
      const newDestination = riojaLocations[Math.floor(Math.random() * riojaLocations.length)];
      Object.assign(destination, newDestination);
    }
    
    const scheduledTime = new Date(today);
    scheduledTime.setHours(8 + Math.floor(Math.random() * 10)); // Entre 8:00 y 18:00
    scheduledTime.setMinutes(Math.floor(Math.random() * 4) * 15); // En intervalos de 15 min
    
    const estimatedPickup = new Date(scheduledTime.getTime() - 30 * 60 * 1000); // 30 min antes
    const estimatedArrival = new Date(scheduledTime.getTime() + Math.random() * 60 * 60 * 1000); // Hasta 1h después
    
    const statuses = ['pending', 'en_route_pickup', 'picked_up', 'en_route_destination', 'delivered', 'cancelled'];
    const status = i === 0 ? 'pending' : statuses[Math.floor(Math.random() * statuses.length)];
    
    services.push({
      id: `srv-${routeId}-${String(i + 1).padStart(3, '0')}`,
      orderNumber: i + 1,
      patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
      origin: origin.name,
      destination: destination.name,
      scheduledTime: scheduledTime.toTimeString().slice(0, 5),
      estimatedPickup: estimatedPickup.toTimeString().slice(0, 5),
      estimatedArrival: estimatedArrival.toTimeString().slice(0, 5),
      transportType: serviceType.transportType,
      observations: `Servicio de ${serviceType.type}. ${serviceType.priority === 'emergency' ? 'URGENTE - ' : ''}Paciente requiere ${serviceType.transportType === 'stretcher' ? 'camilla' : serviceType.transportType === 'wheelchair' ? 'silla de ruedas' : 'asistencia para caminar'}.`,
      status: status as any,
      contactPhone: Math.random() > 0.3 ? `+34 6${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}` : undefined,
      routeId,
      lat: origin.lat,
      lng: origin.lng,
      destLat: destination.lat,
      destLng: destination.lng
    });
  }
  
  return services;
};

// Rutas complejas simuladas
export const mockComplexRoutes = [
  {
    id: 'route-morning-001',
    name: 'Ruta Matutina Centro Logroño',
    description: 'Servicios programados zona centro de mañana',
    ambulanceId: 'AMB-01-LR',
    driverName: 'Carlos Rodríguez',
    assistantName: 'Ana García',
    startTime: '08:00',
    estimatedEndTime: '13:30',
    totalServices: 8,
    completedServices: 3,
    status: 'active' as const,
    services: generateServices('route-morning-001', 8)
  },
  {
    id: 'route-afternoon-002',
    name: 'Ruta Vespertina Norte',
    description: 'Servicios programados zona norte tarde',
    ambulanceId: 'AMB-02-LR',
    driverName: 'Miguel López',
    assistantName: 'Carmen Martínez',
    startTime: '14:00',
    estimatedEndTime: '19:45',
    totalServices: 6,
    completedServices: 1,
    status: 'active' as const,
    services: generateServices('route-afternoon-002', 6)
  },
  {
    id: 'route-emergency-003',
    name: 'Ruta Urgencias Intercentros',
    description: 'Traslados urgentes entre hospitales',
    ambulanceId: 'AMB-03-LR',
    driverName: 'Francisco Jiménez',
    assistantName: 'Elena Torres',
    startTime: '09:30',
    estimatedEndTime: '16:20',
    totalServices: 5,
    completedServices: 2,
    status: 'active' as const,
    services: generateServices('route-emergency-003', 5)
  },
  {
    id: 'route-rural-004',
    name: 'Ruta Rural La Rioja Alta',
    description: 'Servicios en municipios rurales',
    ambulanceId: 'AMB-04-LR',
    driverName: 'José Ramón Sanz',
    assistantName: 'Pilar Vega',
    startTime: '07:45',
    estimatedEndTime: '15:30',
    totalServices: 7,
    completedServices: 4,
    status: 'active' as const,
    services: generateServices('route-rural-004', 7)
  },
  {
    id: 'route-dialysis-005',
    name: 'Ruta Diálisis Especializada',
    description: 'Traslados para sesiones de diálisis',
    ambulanceId: 'AMB-05-LR',
    driverName: 'Antonio Morales',
    assistantName: 'Rosa Delgado',
    startTime: '06:30',
    estimatedEndTime: '14:00',
    totalServices: 9,
    completedServices: 6,
    status: 'active' as const,
    services: generateServices('route-dialysis-005', 9)
  },
  {
    id: 'route-completed-006',
    name: 'Ruta Matutina Finalizada',
    description: 'Servicios completados de la mañana',
    ambulanceId: 'AMB-06-LR',
    driverName: 'Rafael Guerrero',
    assistantName: 'Lucía Peña',
    startTime: '08:00',
    estimatedEndTime: '12:30',
    totalServices: 4,
    completedServices: 4,
    status: 'completed' as const,
    services: generateServices('route-completed-006', 4).map(s => ({ ...s, status: 'delivered' as const }))
  }
];

// Obtener ruta activa actual (primera ruta activa)
export const getCurrentActiveRoute = () => {
  return mockComplexRoutes.find(route => route.status === 'active') || mockComplexRoutes[0];
};

// Obtener próximo servicio en una ruta
export const getNextService = (routeId: string) => {
  const route = mockComplexRoutes.find(r => r.id === routeId);
  if (!route) return null;
  
  return route.services.find(service => 
    service.status === 'pending' || service.status === 'en_route_pickup'
  ) || null;
};

// Estadísticas de rutas para el dashboard
export const getRouteStats = () => {
  const activeRoutes = mockComplexRoutes.filter(r => r.status === 'active');
  const totalServices = activeRoutes.reduce((sum, route) => sum + route.totalServices, 0);
  const completedServices = activeRoutes.reduce((sum, route) => sum + route.completedServices, 0);
  const pendingServices = totalServices - completedServices;
  
  return {
    activeRoutes: activeRoutes.length,
    totalServices,
    completedServices,
    pendingServices,
    completionRate: totalServices > 0 ? Math.round((completedServices / totalServices) * 100) : 0
  };
};
