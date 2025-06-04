
import { TransportRequest } from '@/types/request';

// Generate additional mock services with varied data for daily simulation
const generateMockService = (id: number, baseDate: Date): TransportRequest => {
  const patients = [
    { name: 'María García Sánchez', id: '12345678A', condition: 'Revisión cardiológica' },
    { name: 'José Luis Martín', id: '23456789B', condition: 'Fractura de muñeca' },
    { name: 'Carmen López Ruiz', id: '34567890C', condition: 'Control diabetes' },
    { name: 'Antonio Fernández', id: '45678901D', condition: 'Rehabilitación' },
    { name: 'Elena Rodríguez', id: '56789012E', condition: 'Consulta neurológica' },
    { name: 'Miguel Ángel Torres', id: '67890123F', condition: 'Revisión post-operatoria' },
    { name: 'Isabel Moreno Castro', id: '78901234G', condition: 'Tratamiento oncológico' },
    { name: 'Francisco Jiménez', id: '89012345H', condition: 'Diálisis' },
    { name: 'Ana Belén Serrano', id: '90123456I', condition: 'Consulta ginecológica' },
    { name: 'Carlos Vega Díaz', id: '01234567J', condition: 'Fisioterapia' },
    { name: 'Dolores Herrera', id: '11223344K', condition: 'Control tensión arterial' },
    { name: 'Rafael Muñoz Peña', id: '22334455L', condition: 'Revisión traumatología' },
    { name: 'Teresa Blanco Gil', id: '33445566M', condition: 'Consulta oftalmológica' },
    { name: 'Juan Carlos Ramos', id: '44556677N', condition: 'Control endocrino' },
    { name: 'Pilar Ortega Luna', id: '55667788O', condition: 'Revisión cardiaca' }
  ];

  const origins = [
    'Hospital Clínico San Carlos',
    'Hospital La Paz',
    'Hospital Gregorio Marañón',
    'Hospital 12 de Octubre',
    'Hospital Ramón y Cajal',
    'Centro de Salud Arganzuela',
    'Centro de Salud Retiro',
    'Domicilio Calle Alcalá 150',
    'Domicilio Avenida América 85',
    'Residencia Tercera Edad Los Olivos',
    'Centro Médico Privado Norte',
    'Clínica San Rafael'
  ];

  const destinations = [
    'Hospital La Princesa',
    'Hospital Niño Jesús',
    'Hospital Fundación Jiménez Díaz',
    'Centro de Especialidades Norte',
    'Centro de Rehabilitación Madrid',
    'Hospital de Día Sur',
    'Clínica Universidad de Navarra',
    'Centro Oncológico Integral',
    'Unidad de Diálisis Central',
    'Centro de Fisioterapia Avanzada'
  ];

  const transportTypes = ['stretcher', 'wheelchair', 'walking'] as const;
  const statuses = ['pending', 'assigned', 'inRoute', 'completed', 'cancelled'] as const;
  const priorities = ['low', 'medium', 'high', 'emergency'] as const;
  
  const responsiblePersons = [
    'Dr. García López',
    'Dra. Martínez Sánchez',
    'Dr. Fernández Ruiz',
    'Dra. López Castro',
    'Dr. Rodríguez Vega',
    'Enfermera Coordinadora',
    'Trabajo Social',
    'Familiar Responsable',
    'Emergencias 112',
    'Médico de Cabecera'
  ];

  // Vary the date within a 7-day window
  const dayOffset = (id % 7) - 3; // -3 to +3 days from base date
  const hourOffset = (id % 12) + 8; // Hours between 8 and 19
  const requestDate = new Date(baseDate);
  requestDate.setDate(requestDate.getDate() + dayOffset);
  requestDate.setHours(hourOffset, (id % 4) * 15, 0, 0); // 15-minute intervals

  const patient = patients[id % patients.length];
  const origin = origins[id % origins.length];
  const destination = destinations[id % destinations.length];
  const transportType = transportTypes[id % transportTypes.length];
  const status = statuses[id % statuses.length];
  const priority = priorities[id % priorities.length];
  const responsiblePerson = responsiblePersons[id % responsiblePersons.length];

  // Create estimated arrival time (30-60 minutes after request)
  const estimatedArrival = new Date(requestDate);
  estimatedArrival.setMinutes(estimatedArrival.getMinutes() + 30 + (id % 30));

  return {
    id: `srv-${String(id).padStart(3, '0')}`,
    patientName: patient.name,
    patientId: patient.id,
    responsiblePerson,
    origin,
    destination,
    dateTime: requestDate.toISOString(),
    transportType,
    status,
    priority,
    type: 'simple',
    medicalCondition: patient.condition,
    observations: generateObservation(status, transportType, priority),
    assignedVehicle: status === 'assigned' || status === 'inRoute' || status === 'completed' 
      ? `AMB-${String((id % 5) + 1).padStart(3, '0')}` 
      : undefined,
    estimatedArrival: status === 'assigned' || status === 'inRoute' 
      ? estimatedArrival.toISOString() 
      : undefined,
    createdBy: String((id % 10) + 1),
    createdAt: new Date(requestDate.getTime() - (30 * 60 * 1000)).toISOString(), // 30 minutes before
    updatedAt: requestDate.toISOString(),
    contactPhone: `+34 6${String(id).padStart(2, '0')} ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 900) + 100)}`,
    emergencyContact: `+34 6${String(id + 50).padStart(2, '0')} ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 900) + 100)}`,
    insurance: id % 3 === 0 ? 'Seguridad Social' : id % 3 === 1 ? 'Sanitas' : 'Adeslas'
  };
};

const generateObservation = (status: string, transportType: string, priority: string): string => {
  const observations = {
    pending: [
      'Solicitud pendiente de asignación de vehículo',
      'Esperando confirmación del centro de destino',
      'Paciente preparado para el traslado'
    ],
    assigned: [
      'Vehículo asignado, preparando traslado',
      'Ambulancia en camino al punto de origen',
      'Equipo médico informado del caso'
    ],
    inRoute: [
      'Traslado en curso, paciente estable',
      'En ruta hacia destino, sin incidencias',
      'Paciente monitoreado durante el traslado'
    ],
    completed: [
      'Traslado completado satisfactoriamente',
      'Paciente entregado en destino',
      'Servicio finalizado sin incidencias'
    ],
    cancelled: [
      'Cancelado por mejoría del paciente',
      'Cancelado por decisión familiar',
      'Cancelado por cambio en la programación médica'
    ]
  };

  const typeSpecific = {
    stretcher: 'Requiere camilla para el transporte',
    wheelchair: 'Transporte en silla de ruedas',
    walking: 'Paciente puede caminar, solo necesita acompañamiento'
  };

  const prioritySpecific = {
    low: 'Sin urgencia médica',
    medium: 'Prioridad normal',
    high: 'Requiere atención prioritaria',
    emergency: 'URGENCIA MÉDICA - Traslado inmediato'
  };

  return `${observations[status as keyof typeof observations][0]}. ${typeSpecific[transportType as keyof typeof typeSpecific]}. ${prioritySpecific[priority as keyof typeof prioritySpecific]}.`;
};

// Generate 300 mock services for a comprehensive simulation
export const mockServices: TransportRequest[] = Array.from({ length: 300 }, (_, index) => 
  generateMockService(index + 1, new Date('2024-01-15T10:00:00Z'))
);

export default mockServices;
