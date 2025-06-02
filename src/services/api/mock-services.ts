
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

// Origins and destinations
const locations = [
  'Hospital Clínico San Carlos', 'Hospital La Paz', 'Hospital Gregorio Marañón',
  'Hospital Ramón y Cajal', 'Hospital 12 de Octubre', 'Hospital Puerta de Hierro',
  'Centro de Salud Arganzuela', 'Centro de Salud Retiro', 'Centro de Salud Chamberí',
  'Centro de Rehabilitación San Juan', 'Clínica Ruber', 'Clínica Delfos',
  'Residencia Los Olivos', 'Residencia Virgen del Carmen', 'Domicilio - Calle Mayor 15',
  'Domicilio - Avenida de América 45', 'Domicilio - Plaza de España 8', 'Domicilio - Calle Alcalá 123',
  'Domicilio - Gran Vía 28', 'Domicilio - Paseo de la Castellana 95', 'Hospital Infantil Niño Jesús',
  'Hospital Universitario La Princesa', 'Hospital Clínico Universitario', 'Centro Médico Teknon',
  'Hospital Quirónsalud Madrid', 'Hospital HM Montepríncipe', 'Hospital Sanitas La Zarzuela'
];

const observations = [
  'Paciente con movilidad reducida. Necesita oxígeno portátil.',
  'Cita de revisión cardiológica.',
  'Alta médica. Paciente puede caminar con ayuda.',
  'Urgencia médica. Paciente con dolor abdominal severo.',
  'Sesión de fisioterapia programada.',
  'Tratamiento de quimioterapia.',
  'Alta de urgencias. Paciente estable.',
  'Revisión post-operatoria. Paciente con marcapasos.',
  'Control de diabetes. Paciente insulinodependiente.',
  'Rehabilitación tras cirugía de rodilla.',
  'Consulta de oftalmología. Paciente con problemas de visión.',
  'Sesión de diálisis programada.',
  'Control de embarazo de alto riesgo.',
  'Revisión neurológica tras accidente.',
  'Terapia ocupacional post-ictus.',
  'Control de hipertensión arterial.',
  'Consulta de dermatología.',
  'Revisión de marcapasos.',
  'Control post-quirúrgico.',
  'Sesión de radioterapia.',
  'Consulta de endocrinología.',
  'Control de anticoagulación.',
  'Revisión de prótesis.',
  'Consulta de psiquiatría.',
  'Control de dolor crónico.'
];

const phoneNumbers = [
  '+34 666 123 456', '+34 666 234 567', '+34 666 345 678', '+34 666 456 789',
  '+34 666 567 890', '+34 666 678 901', '+34 666 789 012', '+34 666 890 123',
  '+34 677 123 456', '+34 677 234 567', '+34 688 345 678', '+34 699 456 789'
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
  'Dr. José Rodríguez', 'Dra. Carmen Martínez', 'Dr. Luis García', 'Dra. Ana Fernández',
  'Dr. Miguel Santos', 'Dra. Isabel López', 'Dr. Francisco Ruiz', 'Dra. Teresa Gómez',
  'Emergencias 112', 'Centro Coordinador', 'Familia del paciente', 'Trabajador Social',
  'Dr. Pedro Jiménez', 'Dra. Laura Morales', 'Dr. Antonio Vega', 'Dra. Rosa Delgado'
];

// Generate mock services
export const generateMockServices = (count: number = 300): TransportRequest[] => {
  const services: TransportRequest[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // 30 days ago
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); // 30 days from now

  for (let i = 1; i <= count; i++) {
    const dateTime = getRandomDate(startDate, endDate);
    const status = getRandomElement(statuses);
    const transportType = getRandomElement(transportTypes);
    const priority = getRandomElement(priorities);
    const requestType = getRandomElement(requestTypes);
    
    // Generate DNI-like ID
    const patientId = `${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    
    const service: TransportRequest = {
      id: `srv-${String(i).padStart(3, '0')}`,
      type: requestType,
      patientName: getRandomElement(patientNames),
      patientId,
      responsiblePerson: getRandomElement(responsiblePersons),
      origin: getRandomElement(locations),
      destination: getRandomElement(locations.filter(loc => loc !== service?.origin)),
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
        assignedAmbulance: `amb-${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
        estimatedArrival: new Date(dateTime.getTime() + Math.random() * 2 * 60 * 60 * 1000).toISOString()
      } : {}),
      
      ...(status === 'completed' ? {
        actualArrival: new Date(dateTime.getTime() + Math.random() * 2 * 60 * 60 * 1000).toISOString()
      } : {}),
      
      // Random additional fields
      ...(Math.random() > 0.7 ? {
        medicalCondition: getRandomElement([
          'Diabetes', 'Hipertensión', 'Cardiopatía', 'EPOC', 'Artritis', 'Osteoporosis',
          'Insuficiencia renal', 'Epilepsia', 'Parkinson', 'Alzheimer'
        ])
      } : {}),
      
      ...(Math.random() > 0.8 ? {
        specialRequirements: getRandomElement([
          'Oxígeno portátil', 'Silla de ruedas especial', 'Asistencia médica continua',
          'Medicación específica', 'Dieta especial', 'Acompañante necesario'
        ])
      } : {}),
      
      ...(Math.random() > 0.9 ? {
        architecturalBarriers: getRandomElement([
          'Sin ascensor', 'Escalones en entrada', 'Puerta estrecha',
          'Sin rampa de acceso', 'Escalera caracol'
        ])
      } : {}),
      
      ...(Math.random() > 0.85 ? {
        specialAttention: getRandomElement([
          'Paciente agresivo', 'Claustrofobia', 'Ansiedad severa',
          'No habla español', 'Problemas de audición', 'Demencia'
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
