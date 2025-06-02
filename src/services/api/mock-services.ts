
import { TransportRequest } from '@/types/request';

// Helper function to generate random dates
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to get random element from array
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Patient names pool
const patientNames = [
  'María García López', 'Juan Martínez Ruiz', 'Ana Rodríguez Pérez', 'Carlos López Fernández',
  'Isabel Gómez Torres', 'Miguel Sánchez Díaz', 'Carmen Ruiz Moreno', 'Francisco Torres Gil',
  'Laura Jiménez Vega', 'Antonio Morales Castro', 'Elena Vargas Herrera', 'José Ramírez Ortega',
  'Pilar Delgado Ramos', 'Rafael Guerrero Medina', 'Lucía Peña Molina', 'Manuel Aguilar Cruz',
  'Rosa Vázquez Serrano', 'Pedro Romero Iglesias', 'Cristina Muñoz Campos', 'Andrés Rubio León',
  'Teresa Márquez Fuentes', 'Javier Castillo Núñez', 'Amparo Hernández Cabrera', 'Emilio Santos Blanco',
  'Dolores Fernández Nieto', 'Ramón Álvarez Pascual', 'Montserrat Domínguez Moreno', 'Fernando Navarro Gil',
  'Consuelo Jiménez Prieto', 'Sebastián Guerrero Herrero', 'Remedios Vega Cortés', 'Joaquín Morales Reyes',
  'Esperanza Ruiz Gallego', 'Vicente Sánchez Márquez', 'Rosario Pérez Hidalgo', 'Enrique García Lozano',
  'Encarnación López Serrano', 'Salvador Martínez Cano', 'Purificación Rodríguez Mesa', 'Jesús Torres Romero'
];

// Locations in La Rioja
const locations = [
  'Hospital San Pedro - Logroño', 'Hospital de la Rioja - Logroño', 'Centro de Salud Cascajos - Logroño',
  'Centro de Salud Espartero - Logroño', 'Centro de Salud Rodríguez Paterna - Logroño',
  'Centro de Salud Siete Infantes de Lara - Logroño', 'Centro de Salud Gonzalo de Berceo - Logroño',
  'Hospital de Calahorra', 'Centro de Salud Calahorra', 'Centro de Salud Arnedo',
  'Hospital de Haro', 'Centro de Salud Haro', 'Centro de Salud Santo Domingo de la Calzada',
  'Centro de Salud Nájera', 'Centro de Salud Alfaro', 'Centro de Salud Cervera del Río Alhama',
  'Residencia de Mayores Los Royales - Logroño', 'Residencia San Bernabé - Logroño',
  'Centro de Día La Estrella - Logroño', 'Domicilio - Calle Bretón de los Herreros 25, Logroño',
  'Domicilio - Avenida de la Paz 45, Logroño', 'Domicilio - Calle Portales 8, Logroño',
  'Domicilio - Gran Vía 28, Logroño', 'Domicilio - Calle Sagasta 95, Logroño',
  'Clínica Vistahermosa - Logroño', 'Clínica San José - Logroño', 'Centro Médico La Rioja',
  'Hospital Reina Sofía - Tudela (Navarra)', 'Clínica Universidad de Navarra - Pamplona',
  'Hospital Universitario de Burgos', 'Hospital Santiago Apóstol - Miranda de Ebro',
  'Domicilio - Calle Mayor 15, Haro', 'Domicilio - Plaza España 3, Calahorra',
  'Domicilio - Avenida Numancia 12, Soria', 'Centro de Salud Pradejón',
  'Centro de Salud Rincón de Soto', 'Centro de Salud Villamediana de Iregua'
];

const observations = [
  'Paciente con movilidad reducida. Necesita oxígeno portátil.',
  'Cita de revisión cardiológica en Hospital San Pedro.',
  'Alta médica. Paciente puede caminar con ayuda.',
  'Urgencia médica. Paciente con dolor abdominal severo.',
  'Sesión de fisioterapia programada en centro especializado.',
  'Tratamiento de quimioterapia en Hospital de la Rioja.',
  'Alta de urgencias. Paciente estable para traslado.',
  'Revisión post-operatoria. Paciente con marcapasos.',
  'Control de diabetes. Paciente insulinodependiente.',
  'Rehabilitación tras cirugía de rodilla.',
  'Consulta de oftalmología especializada.',
  'Sesión de diálisis programada en Hospital San Pedro.',
  'Control de embarazo de alto riesgo.',
  'Revisión neurológica tras accidente de tráfico.',
  'Terapia ocupacional post-ictus.',
  'Control de hipertensión arterial.',
  'Consulta de dermatología en Hospital de la Rioja.',
  'Revisión de marcapasos en unidad especializada.',
  'Control post-quirúrgico tras cirugía abdominal.',
  'Sesión de radioterapia programada.',
  'Consulta de endocrinología pediátrica.',
  'Control de anticoagulación oral.',
  'Revisión de prótesis de cadera.',
  'Consulta de psiquiatría infantil.',
  'Control de dolor crónico en unidad especializada.'
];

const phoneNumbers = [
  '+34 641 123 456', '+34 641 234 567', '+34 641 345 678', '+34 641 456 789',
  '+34 641 567 890', '+34 641 678 901', '+34 641 789 012', '+34 641 890 123',
  '+34 696 123 456', '+34 696 234 567', '+34 698 345 678', '+34 699 456 789'
];

const statuses: Array<'pending' | 'assigned' | 'inRoute' | 'completed' | 'cancelled'> = [
  'pending', 'assigned', 'inRoute', 'completed', 'cancelled'
];

const priorities: Array<'low' | 'medium' | 'high' | 'emergency'> = [
  'low', 'medium', 'high', 'emergency'
];

const transportTypes: Array<'stretcher' | 'wheelchair' | 'walking'> = [
  'stretcher', 'wheelchair', 'walking'
];

const requestTypes: Array<'simple' | 'scheduled' | 'advanced'> = [
  'simple', 'scheduled', 'advanced'
];

const responsiblePersons = [
  'Dr. José Rodríguez García', 'Dra. Carmen Martínez López', 'Dr. Luis García Ruiz', 'Dra. Ana Fernández Sanz',
  'Dr. Miguel Santos Pérez', 'Dra. Isabel López Torres', 'Dr. Francisco Ruiz Jiménez', 'Dra. Teresa Gómez Morales',
  'Emergencias 112 La Rioja', 'Centro Coordinador Sanitario', 'Familia del paciente', 'Trabajador Social',
  'Dr. Pedro Jiménez Vega', 'Dra. Laura Morales Castro', 'Dr. Antonio Vega Herrera', 'Dra. Rosa Delgado Ramos',
  'Dr. Rafael Guerrero (Hospital San Pedro)', 'Dra. Lucía Peña (Hospital de la Rioja)', 'Dr. Manuel Aguilar (Haro)',
  'Dra. Carmen Vázquez (Calahorra)'
];

// Generate mock services
export const generateMockServices = (count: number = 300): TransportRequest[] => {
  const services: TransportRequest[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 15); // 15 days ago
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 45); // 45 days from now

  for (let i = 1; i <= count; i++) {
    const dateTime = getRandomDate(startDate, endDate);
    const status = getRandomElement(statuses);
    const transportType = getRandomElement(transportTypes);
    const priority = getRandomElement(priorities);
    const requestType = getRandomElement(requestTypes);
    const origin = getRandomElement(locations);
    
    // Generate DNI-like ID
    const patientId = `${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    
    const service: TransportRequest = {
      id: `srv-${String(i).padStart(3, '0')}`,
      type: requestType,
      patientName: getRandomElement(patientNames),
      patientId,
      responsiblePerson: getRandomElement(responsiblePersons),
      origin,
      destination: getRandomElement(locations.filter(loc => loc !== origin)),
      dateTime: dateTime.toISOString(),
      transportType,
      status,
      priority,
      observations: getRandomElement(observations),
      contactPhone: Math.random() > 0.3 ? getRandomElement(phoneNumbers) : undefined,
      emergencyContact: Math.random() > 0.5 ? getRandomElement(phoneNumbers) : undefined,
      insurance: Math.random() > 0.2 ? 'Seguridad Social' : 'Privado',
      createdBy: `user-${Math.floor(Math.random() * 10) + 1}`,
      createdAt: new Date(dateTime.getTime() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: dateTime.toISOString(),
      
      // Add additional fields based on status
      ...(status === 'assigned' || status === 'inRoute' || status === 'completed' ? {
        assignedAmbulance: `AMB-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}-LR`,
        estimatedArrival: new Date(dateTime.getTime() + Math.random() * 2 * 60 * 60 * 1000).toISOString()
      } : {}),
      
      ...(status === 'completed' ? {
        actualArrival: new Date(dateTime.getTime() + Math.random() * 2 * 60 * 60 * 1000).toISOString()
      } : {}),
      
      // Random additional fields
      ...(Math.random() > 0.7 ? {
        medicalCondition: getRandomElement([
          'Diabetes', 'Hipertensión', 'Cardiopatía', 'EPOC', 'Artritis', 'Osteoporosis',
          'Insuficiencia renal', 'Epilepsia', 'Parkinson', 'Alzheimer', 'Fractura de cadera',
          'Ictus', 'Insuficiencia cardíaca', 'Cáncer', 'Demencia'
        ])
      } : {}),
      
      ...(Math.random() > 0.8 ? {
        specialRequirements: getRandomElement([
          'Oxígeno portátil', 'Silla de ruedas especial', 'Asistencia médica continua',
          'Medicación específica', 'Dieta especial', 'Acompañante necesario',
          'Monitor cardíaco', 'Desfibrilador', 'Bomba de insulina'
        ])
      } : {}),
      
      ...(Math.random() > 0.9 ? {
        architecturalBarriers: getRandomElement([
          'Sin ascensor', 'Escalones en entrada', 'Puerta estrecha',
          'Sin rampa de acceso', 'Escalera caracol', 'Edificio sin accesibilidad'
        ])
      } : {}),
      
      ...(Math.random() > 0.85 ? {
        specialAttention: getRandomElement([
          'Paciente agresivo', 'Claustrofobia', 'Ansiedad severa',
          'No habla español', 'Problemas de audición', 'Demencia avanzada',
          'Riesgo de caídas', 'Alergia a medicamentos'
        ])
      } : {})
    };
    
    services.push(service);
  }
  
  return services.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
};

// Export the generated services
export const mockServices = generateMockServices(300);

// Export different subsets for testing
export const mockServicesSmall = generateMockServices(50);
export const mockServicesMedium = generateMockServices(150);
export const mockServicesLarge = generateMockServices(300);

// Export services by status for testing specific scenarios
export const mockPendingServices = mockServices.filter(s => s.status === 'pending');
export const mockAssignedServices = mockServices.filter(s => s.status === 'assigned');
export const mockInRouteServices = mockServices.filter(s => s.status === 'inRoute');
export const mockCompletedServices = mockServices.filter(s => s.status === 'completed');
export const mockCancelledServices = mockServices.filter(s => s.status === 'cancelled');

// Export services by priority
export const mockEmergencyServices = mockServices.filter(s => s.priority === 'emergency');
export const mockHighPriorityServices = mockServices.filter(s => s.priority === 'high');

// Export services by transport type
export const mockStretcherServices = mockServices.filter(s => s.transportType === 'stretcher');
export const mockWheelchairServices = mockServices.filter(s => s.transportType === 'wheelchair');
export const mockWalkingServices = mockServices.filter(s => s.transportType === 'walking');
