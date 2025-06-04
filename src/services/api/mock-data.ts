
import { User } from '@/types/user';
import { Ambulance } from '@/types/ambulance';
import { TransportRequest } from '@/types/request';
import { Route } from '@/types/route';
import { Message, Conversation } from '@/types/message';

// Mock Users - Expanded with more realistic data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@ambulancias.com',
    name: 'Carlos Administrador',
    role: 'admin',
    isActive: true,
    phone: '+34 600 123 456',
    organization: 'Central de Ambulancias Madrid',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T09:30:00Z'
  },
  {
    id: '2',
    email: 'coordinador@ambulancias.com',
    name: 'María Centro Coordinador',
    role: 'centroCoordinador',
    isActive: true,
    phone: '+34 600 234 567',
    organization: 'Centro Coordinador Norte',
    createdAt: '2024-01-02T00:00:00Z',
    lastLogin: '2024-01-15T08:45:00Z'
  },
  {
    id: '3',
    email: 'hospital@salud.com',
    name: 'Dr. Juan Hospital General',
    role: 'hospital',
    isActive: true,
    phone: '+34 600 345 678',
    organization: 'Hospital General Madrid',
    createdAt: '2024-01-03T00:00:00Z',
    lastLogin: '2024-01-15T10:15:00Z'
  },
  {
    id: '4',
    email: 'hospital.paz@salud.com',
    name: 'Dra. Ana Hospital La Paz',
    role: 'hospital',
    isActive: true,
    phone: '+34 600 456 789',
    organization: 'Hospital La Paz',
    createdAt: '2024-01-04T00:00:00Z',
    lastLogin: '2024-01-15T11:20:00Z'
  },
  {
    id: '5',
    email: 'clinico@salud.com',
    name: 'Dr. Luis Clínico',
    role: 'hospital',
    isActive: true,
    phone: '+34 600 567 890',
    organization: 'Hospital Clínico San Carlos',
    createdAt: '2024-01-05T00:00:00Z',
    lastLogin: '2024-01-15T12:00:00Z'
  },
  {
    id: '6',
    email: 'ambulancia1@madrid.com',
    name: 'Pedro Conductor AMB-001',
    role: 'ambulance',
    isActive: true,
    phone: '+34 600 678 901',
    organization: 'Flota Ambulancias Madrid',
    createdAt: '2024-01-06T00:00:00Z',
    lastLogin: '2024-01-15T07:30:00Z'
  },
  {
    id: '7',
    email: 'ambulancia2@madrid.com',
    name: 'Carmen Médico AMB-002',
    role: 'ambulance',
    isActive: true,
    phone: '+34 600 789 012',
    organization: 'Flota Ambulancias Madrid',
    createdAt: '2024-01-07T00:00:00Z',
    lastLogin: '2024-01-15T08:00:00Z'
  },
  {
    id: '8',
    email: 'usuario1@gmail.com',
    name: 'Elena Particular',
    role: 'individual',
    isActive: true,
    phone: '+34 600 890 123',
    organization: 'Usuario Particular',
    createdAt: '2024-01-08T00:00:00Z',
    lastLogin: '2024-01-15T14:30:00Z'
  },
  {
    id: '9',
    email: 'coordinador2@ambulancias.com',
    name: 'Roberto Centro Sur',
    role: 'centroCoordinador',
    isActive: true,
    phone: '+34 600 901 234',
    organization: 'Centro Coordinador Sur',
    createdAt: '2024-01-09T00:00:00Z',
    lastLogin: '2024-01-15T09:15:00Z'
  },
  {
    id: '10',
    email: 'emergencias@112.es',
    name: 'Operador 112',
    role: 'centroCoordinador',
    isActive: true,
    phone: '+34 112',
    organization: 'Emergencias 112',
    createdAt: '2024-01-10T00:00:00Z',
    lastLogin: '2024-01-15T06:00:00Z'
  }
];

// Mock Ambulances - Expanded fleet
export const mockAmbulances: Ambulance[] = [
  {
    id: 'amb-001',
    vehicleId: 'AMB-001',
    licensePlate: '1234-ABC',
    model: 'Mercedes Sprinter 2023',
    type: 'Tipo B',
    status: 'available',
    equipment: ['Desfibrilador', 'Oxígeno', 'Camilla hidráulica', 'Monitor cardiaco'],
    currentLocation: {
      lat: 40.4168,
      lng: -3.7038,
      address: 'Plaza Mayor, Madrid'
    },
    assignedDriver: 'Pedro Conductor',
    assignedMedic: 'Dra. María García',
    capacity: 2,
    fuelLevel: 85,
    lastMaintenance: '2024-01-01',
    nextMaintenance: '2024-02-01',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'amb-002',
    vehicleId: 'AMB-002',
    licensePlate: '5678-DEF',
    model: 'Ford Transit 2022',
    type: 'Tipo A',
    status: 'busy',
    equipment: ['Botiquín básico', 'Oxígeno portátil', 'Camilla básica'],
    currentLocation: {
      lat: 40.4200,
      lng: -3.6900,
      address: 'Hospital La Paz, Madrid'
    },
    assignedDriver: 'Carmen Médico',
    capacity: 1,
    fuelLevel: 60,
    lastMaintenance: '2023-12-15',
    nextMaintenance: '2024-01-30',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'amb-003',
    vehicleId: 'AMB-003',
    licensePlate: '9012-GHI',
    model: 'Volkswagen Crafter 2023',
    type: 'Tipo C',
    status: 'available',
    equipment: ['UCI móvil', 'Respirador', 'Desfibrilador avanzado', 'Medicación de emergencia'],
    currentLocation: {
      lat: 40.4100,
      lng: -3.7200,
      address: 'Hospital Clínico San Carlos, Madrid'
    },
    assignedDriver: 'Miguel Rodríguez',
    assignedMedic: 'Dr. Carlos Fernández',
    capacity: 3,
    fuelLevel: 92,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'amb-004',
    vehicleId: 'AMB-004',
    licensePlate: '3456-JKL',
    model: 'Mercedes Sprinter 2021',
    type: 'Tipo B',
    status: 'maintenance',
    equipment: ['Desfibrilador', 'Oxígeno', 'Camilla hidráulica'],
    currentLocation: {
      lat: 40.3900,
      lng: -3.6800,
      address: 'Taller Central, Madrid'
    },
    assignedDriver: 'Laura Sánchez',
    capacity: 2,
    fuelLevel: 45,
    lastMaintenance: '2024-01-14',
    nextMaintenance: '2024-02-14',
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'amb-005',
    vehicleId: 'AMB-005',
    licensePlate: '7890-MNO',
    model: 'Ford Transit 2023',
    type: 'Tipo A',
    status: 'available',
    equipment: ['Botiquín básico', 'Oxígeno portátil', 'Camilla básica'],
    currentLocation: {
      lat: 40.4300,
      lng: -3.7100,
      address: 'Base Norte, Madrid'
    },
    assignedDriver: 'Antonio López',
    capacity: 1,
    fuelLevel: 78,
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-02-05',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Mock Requests - More diverse scenarios
export const mockRequests: TransportRequest[] = [
  {
    id: 'req-001',
    type: 'simple',
    patientName: 'Ana Martínez López',
    patientId: '12345678A',
    responsiblePerson: 'Dr. José Rodríguez',
    origin: 'Hospital Clínico San Carlos',
    destination: 'Hospital La Paz',
    dateTime: '2024-01-15T14:30:00Z',
    transportType: 'stretcher',
    status: 'assigned',
    priority: 'medium',
    medicalCondition: 'Fractura de cadera',
    observations: 'Paciente consciente, requiere cuidado especial en el traslado',
    assignedAmbulance: 'amb-001',
    estimatedArrival: '2024-01-15T15:15:00Z',
    createdBy: '3',
    createdAt: '2024-01-15T13:00:00Z',
    updatedAt: '2024-01-15T13:30:00Z',
    contactPhone: '+34 600 111 222',
    emergencyContact: '+34 600 333 444',
    insurance: 'Seguridad Social'
  },
  {
    id: 'req-002',
    type: 'advanced',
    patientName: 'Pedro González Ruiz',
    patientId: '87654321B',
    responsiblePerson: 'Emergencias 112',
    origin: 'Calle Gran Vía 45, Madrid',
    destination: 'Hospital Gregorio Marañón',
    dateTime: '2024-01-15T16:45:00Z',
    transportType: 'stretcher',
    status: 'inRoute',
    priority: 'emergency',
    medicalCondition: 'Infarto agudo de miocardio',
    observations: 'Urgencia vital, trasladar inmediatamente con soporte vital',
    assignedAmbulance: 'amb-003',
    estimatedArrival: '2024-01-15T17:00:00Z',
    createdBy: '10',
    createdAt: '2024-01-15T16:30:00Z',
    updatedAt: '2024-01-15T16:50:00Z',
    contactPhone: '+34 600 555 666',
    emergencyContact: '+34 600 777 888'
  },
  {
    id: 'req-003',
    type: 'simple',
    patientName: 'Carmen Delgado Vega',
    patientId: '11223344C',
    responsiblePerson: 'Dra. Ana Hospital La Paz',
    origin: 'Hospital La Paz',
    destination: 'Centro de Rehabilitación Norte',
    dateTime: '2024-01-15T10:00:00Z',
    transportType: 'wheelchair',
    status: 'completed',
    priority: 'low',
    medicalCondition: 'Rehabilitación post-operatoria',
    observations: 'Paciente estable, requiere silla de ruedas',
    assignedAmbulance: 'amb-005',
    estimatedArrival: '2024-01-15T10:30:00Z',
    createdBy: '4',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    contactPhone: '+34 600 999 111',
    emergencyContact: '+34 600 888 222',
    insurance: 'Seguridad Social'
  },
  {
    id: 'req-004',
    type: 'simple',
    patientName: 'Roberto Silva Moreno',
    patientId: '55667788D',
    responsiblePerson: 'Elena Particular',
    origin: 'Domicilio Calle Serrano 123',
    destination: 'Hospital Ramón y Cajal',
    dateTime: '2024-01-15T12:15:00Z',
    transportType: 'walking',
    status: 'pending',
    priority: 'medium',
    medicalCondition: 'Control médico rutinario',
    observations: 'Paciente puede caminar, solo necesita transporte',
    createdBy: '8',
    createdAt: '2024-01-15T11:45:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
    contactPhone: '+34 600 123 987',
    emergencyContact: '+34 600 456 321',
    insurance: 'Sanitas'
  },
  {
    id: 'req-005',
    type: 'advanced',
    patientName: 'Isabel Fernández Castro',
    patientId: '99887766E',
    responsiblePerson: 'Dr. Luis Clínico',
    origin: 'Hospital Clínico San Carlos',
    destination: 'Hospital 12 de Octubre',
    dateTime: '2024-01-15T18:00:00Z',
    transportType: 'stretcher',
    status: 'assigned',
    priority: 'high',
    medicalCondition: 'Accidente cerebrovascular',
    observations: 'Paciente crítico, requiere monitorización continua',
    assignedAmbulance: 'amb-002',
    estimatedArrival: '2024-01-15T18:30:00Z',
    createdBy: '5',
    createdAt: '2024-01-15T17:30:00Z',
    updatedAt: '2024-01-15T17:45:00Z',
    contactPhone: '+34 600 654 789',
    emergencyContact: '+34 600 321 654',
    insurance: 'Seguridad Social'
  },
  {
    id: 'req-006',
    type: 'simple',
    patientName: 'Manuel Torres Díaz',
    patientId: '44556677F',
    responsiblePerson: 'Roberto Centro Sur',
    origin: 'Centro de Salud Vallecas',
    destination: 'Hospital Infanta Sofía',
    dateTime: '2024-01-15T08:30:00Z',
    transportType: 'stretcher',
    status: 'cancelled',
    priority: 'medium',
    medicalCondition: 'Fractura de tobillo',
    observations: 'Cancelado por mejoría del paciente',
    createdBy: '9',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:15:00Z',
    contactPhone: '+34 600 741 852',
    emergencyContact: '+34 600 963 741',
    insurance: 'Seguridad Social'
  }
];

// Mock Routes - More detailed routing information
export const mockRoutes: Route[] = [
  {
    id: 'route-001',
    name: 'Ruta Hospitales Centro',
    ambulanceId: 'amb-001',
    points: [
      {
        lat: 40.4168,
        lng: -3.7038,
        address: 'Hospital Clínico San Carlos',
        type: 'pickup',
        requestId: 'req-001',
        estimatedTime: '14:30'
      },
      {
        lat: 40.4200,
        lng: -3.6900,
        address: 'Hospital La Paz',
        type: 'dropoff',
        requestId: 'req-001',
        estimatedTime: '15:15'
      }
    ],
    distance: 8.5,
    estimatedDuration: 45,
    status: 'active',
    startTime: '2024-01-15T14:25:00Z',
    createdBy: '2',
    createdAt: '2024-01-15T13:30:00Z',
    optimized: true
  },
  {
    id: 'route-002',
    name: 'Emergencia Gran Vía',
    ambulanceId: 'amb-003',
    points: [
      {
        lat: 40.4200,
        lng: -3.7000,
        address: 'Calle Gran Vía 45, Madrid',
        type: 'pickup',
        requestId: 'req-002',
        estimatedTime: '16:45'
      },
      {
        lat: 40.4312,
        lng: -3.6838,
        address: 'Hospital Gregorio Marañón',
        type: 'dropoff',
        requestId: 'req-002',
        estimatedTime: '17:00'
      }
    ],
    distance: 4.2,
    estimatedDuration: 15,
    status: 'active',
    startTime: '2024-01-15T16:35:00Z',
    createdBy: '10',
    createdAt: '2024-01-15T16:30:00Z',
    optimized: true
  }
];

// Mock Conversations - More realistic communication
export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    participantIds: ['1', '2'],
    title: 'Coordinación General',
    type: 'direct',
    unreadCount: 2,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'conv-002',
    participantIds: ['2', '10'],
    title: 'Emergencias 112',
    type: 'direct',
    unreadCount: 1,
    createdAt: '2024-01-15T16:30:00Z',
    updatedAt: '2024-01-15T16:45:00Z'
  },
  {
    id: 'conv-003',
    participantIds: ['3', '4', '5'],
    title: 'Coordinación Hospitales',
    type: 'group',
    unreadCount: 0,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T14:20:00Z'
  }
];

// Mock Messages - Daily communication scenarios
export const mockMessages: Message[] = [
  {
    id: 'msg-001',
    senderId: '2',
    recipientId: '1',
    content: 'Necesitamos asignar una ambulancia para el traslado urgente del req-002',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    type: 'text',
    conversationId: 'conv-001'
  },
  {
    id: 'msg-002',
    senderId: '10',
    recipientId: '2',
    content: 'Emergencia en Gran Vía, necesitamos ambulancia tipo C inmediatamente',
    timestamp: '2024-01-15T16:45:00Z',
    read: false,
    type: 'text',
    conversationId: 'conv-002'
  },
  {
    id: 'msg-003',
    senderId: '3',
    recipientId: '4',
    content: 'Confirmado traslado de paciente Carmen Delgado completado exitosamente',
    timestamp: '2024-01-15T11:00:00Z',
    read: true,
    type: 'text',
    conversationId: 'conv-003'
  },
  {
    id: 'msg-004',
    senderId: '1',
    recipientId: '2',
    content: 'AMB-003 asignada para emergencia, ETA 15 minutos',
    timestamp: '2024-01-15T16:50:00Z',
    read: true,
    type: 'text',
    conversationId: 'conv-001'
  }
];
