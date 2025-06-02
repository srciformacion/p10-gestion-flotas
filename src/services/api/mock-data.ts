
import { User } from '@/types/user';
import { Ambulance } from '@/types/ambulance';
import { TransportRequest } from '@/types/request';
import { Route } from '@/types/route';
import { Message, Conversation } from '@/types/message';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@ambulancias.com',
    name: 'Administrador Principal',
    role: 'admin',
    isActive: true,
    phone: '+34 600 123 456',
    organization: 'Central de Ambulancias',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T09:30:00Z'
  },
  {
    id: '2',
    email: 'coordinador@ambulancias.com',
    name: 'Centro Coordinador',
    role: 'centroCoordinador',
    isActive: true,
    phone: '+34 600 234 567',
    organization: 'Central de Ambulancias',
    createdAt: '2024-01-02T00:00:00Z',
    lastLogin: '2024-01-15T08:45:00Z'
  },
  {
    id: '3',
    email: 'hospital@salud.com',
    name: 'Hospital General',
    role: 'hospital',
    isActive: true,
    phone: '+34 600 345 678',
    organization: 'Hospital General Madrid',
    createdAt: '2024-01-03T00:00:00Z',
    lastLogin: '2024-01-15T10:15:00Z'
  }
];

// Mock Ambulances
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
    assignedDriver: 'Juan Pérez',
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
    assignedDriver: 'Carlos López',
    capacity: 1,
    fuelLevel: 60,
    lastMaintenance: '2023-12-15',
    nextMaintenance: '2024-01-30',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Mock Requests
export const mockRequests: TransportRequest[] = [
  {
    id: 'req-001',
    type: 'simple',
    patientName: 'Ana Martínez',
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
    type: 'emergency',
    patientName: 'Pedro González',
    patientId: '87654321B',
    responsiblePerson: 'Emergencias 112',
    origin: 'Calle Gran Vía 45, Madrid',
    destination: 'Hospital Gregorio Marañón',
    dateTime: '2024-01-15T16:45:00Z',
    transportType: 'stretcher',
    status: 'inRoute',
    priority: 'emergency',
    medicalCondition: 'Infarto agudo de miocardio',
    observations: 'Urgencia vital, trasladar inmediatamente',
    assignedAmbulance: 'amb-002',
    estimatedArrival: '2024-01-15T17:00:00Z',
    createdBy: '2',
    createdAt: '2024-01-15T16:30:00Z',
    updatedAt: '2024-01-15T16:50:00Z',
    contactPhone: '+34 600 555 666',
    emergencyContact: '+34 600 777 888'
  }
];

// Mock Routes
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
  }
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    participants: ['1', '2'],
    title: 'Coordinación General',
    type: 'direct',
    unreadCount: 2,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

// Mock Messages
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
  }
];
