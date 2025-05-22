
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  isLoading: boolean;
}

// Mock data for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@ambulink.com',
    name: 'Admin Usuario',
    role: 'admin'
  },
  {
    id: '2',
    email: 'hospital@ambulink.com',
    name: 'Hospital Central',
    role: 'hospital'
  },
  {
    id: '3',
    email: 'usuario@ambulink.com',
    name: 'María García',
    role: 'individual'
  },
  {
    id: '4',
    email: 'ambulancia@ambulink.com',
    name: 'Ambulancias Rápidas',
    role: 'ambulance'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada en localStorage
    const storedUser = localStorage.getItem('ambulink_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulación de un retraso de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Buscar el usuario en los datos de prueba
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (foundUser && password === '123456') { // contraseña de prueba
        setUser(foundUser);
        localStorage.setItem('ambulink_user', JSON.stringify(foundUser));
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ambulink_user');
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulación de un retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar si el correo ya existe
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        throw new Error('El correo electrónico ya está registrado');
      }
      
      // Crear un nuevo usuario (en una aplicación real, esto iría a la base de datos)
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role
      };
      
      // En una aplicación real, guardaríamos el usuario en la base de datos
      // Aquí solo simulamos el éxito
      setUser(newUser);
      localStorage.setItem('ambulink_user', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error de registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
