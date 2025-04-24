
import { User } from '@/types';

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
  }
};

