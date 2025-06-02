
import { User, UserRole } from '@/types';

// Usuarios de prueba con sus roles correspondientes
const TEST_USERS: Record<string, { name: string; role: UserRole }> = {
  'admin@ambulink.com': { name: 'Administrador del Sistema', role: 'admin' },
  'hospital@ambulink.com': { name: 'Hospital San Pedro', role: 'hospital' },
  'usuario@ambulink.com': { name: 'Juan Pérez - Paciente', role: 'individual' },
  'ambulancia@ambulink.com': { name: 'Ambulancias La Rioja S.L.', role: 'ambulance' },
  'coordinador@ambulink.com': { name: 'Centro Coordinador 112', role: 'centroCoordinador' },
  'equipo@ambulink.com': { name: 'Equipo Móvil Alpha', role: 'equipoMovil' }
};

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    // Simular verificación de credenciales
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Obtener datos del usuario según el email
    const userData = TEST_USERS[email] || { 
      name: 'Usuario Demo', 
      role: 'individual' as UserRole 
    };
    
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      name: userData.name,
      role: userData.role,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  },

  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User | null> => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  },

  register: async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      name,
      role,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  }
};
