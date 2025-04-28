
import { User, UserRole } from '@/types';

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    // Simular verificación de credenciales
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Define test users with appropriate roles
    const mockUsers: Record<string, User> = {
      'admin@ambulink.com': {
        id: '1',
        email: 'admin@ambulink.com',
        name: 'Administrador',
        role: 'admin'
      },
      'hospital@ambulink.com': {
        id: '2',
        email: 'hospital@ambulink.com',
        name: 'Hospital San Pedro',
        role: 'hospital'
      },
      'usuario@ambulink.com': {
        id: '3',
        email: 'usuario@ambulink.com',
        name: 'Juan Paciente',
        role: 'individual'
      },
      'ambulancia@ambulink.com': {
        id: '4',
        email: 'ambulancia@ambulink.com',
        name: 'Ambulancias Express',
        role: 'ambulance'
      }
    };
    
    // Get the user by email or return admin as fallback
    const user = mockUsers[email] || mockUsers['admin@ambulink.com'];
    
    localStorage.setItem('user', JSON.stringify(user));
    return user;
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
      role
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  }
};
