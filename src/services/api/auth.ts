
import { User, UserRole } from '@/types';

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    // Simular verificación de credenciales
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: '1',
      email,
      name: 'Usuario Demo',
      role: 'admin'
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
      role
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    return mockUser;
  }
};
