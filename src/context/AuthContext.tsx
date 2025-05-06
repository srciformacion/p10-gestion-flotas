
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { UserRole, User } from '@/types';
import { toast } from "@/components/ui/sonner";
import { authApi } from '@/services/api/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  simulateDemoLogin: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Inicializando AuthContext');
    
    // Establecer el listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Evento de autenticación:', event);
        setSession(currentSession);
        
        // Actualizar el usuario con su rol
        if (currentSession?.user) {
          console.log('Usuario en sesión:', currentSession.user.email);
          setTimeout(async () => {
            try {
              // Obtener el perfil del usuario de la tabla profiles
              // Corregimos la consulta para evitar error de tipo
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role, full_name')
                .eq('id', currentSession.user.id)
                .maybeSingle(); // Usamos maybeSingle en lugar de single
              
              if (error) {
                console.error('Error al cargar el perfil:', error);
                throw error;
              }
              
              if (!profile) {
                console.warn('Perfil no encontrado para usuario:', currentSession.user.id);
              }
              
              // Combinar datos de usuario con su rol y nombre para crear un objeto User compatible
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: profile?.full_name || '',
                role: (profile?.role as UserRole) || 'individual' // Valor predeterminado si no hay rol
              });
            } catch (error) {
              console.error('Error al cargar el perfil:', error);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Comprobar si hay una sesión al cargar
    const checkSession = async () => {
      try {
        console.log('Verificando sesión existente');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        // Si hay sesión, cargar datos del perfil
        if (currentSession?.user) {
          console.log('Sesión encontrada para:', currentSession.user.email);
          // Corregimos la consulta para evitar error de tipo
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', currentSession.user.id)
            .maybeSingle(); // Usamos maybeSingle en lugar de single
          
          if (error) {
            console.error('Error al cargar perfil inicial:', error);
            throw error;
          }
          
          // Asegurar que el usuario cumple con la interfaz User
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            name: profile?.full_name || '',
            role: (profile?.role as UserRole) || 'individual' // Valor predeterminado si no hay rol
          });
        } else {
          console.log('No se encontró sesión activa');
        }
      } catch (error) {
        console.error('Error al cargar la sesión:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      console.log('Intentando login para:', email);
      await authApi.login(email, password);
      // La sesión y el usuario se actualizarán automáticamente con el listener onAuthStateChange
      return;
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      throw error; // Propagamos el error para manejarlo en el componente Login
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      await authApi.register(name, email, password, role);
      return;
    } catch (error: any) {
      toast.error("Error al registrarse", {
        description: error.message || "No se pudo completar el registro"
      });
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await authApi.logout();
      // La sesión y el usuario se actualizarán automáticamente con el listener onAuthStateChange
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión", {
        description: error.message
      });
    }
  };

  // Función para simular inicio de sesión con cuentas de demostración
  const simulateDemoLogin = async (role: UserRole) => {
    try {
      // Generar un ID único para el usuario simulado
      const demoUserId = `demo-${role}-${Date.now()}`;
      
      // Crear un usuario demo basado en el rol
      let demoUser: User = {
        id: demoUserId,
        email: `${role}@demo.ambulink.com`,
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        role: role
      };
      
      console.log('Simulando inicio de sesión para:', demoUser);
      
      // Actualizar el estado de autenticación
      setUser(demoUser);
      
      // No tenemos un session real para demostración, pero creamos un objeto similar
      const mockSession = {
        access_token: `demo-token-${demoUserId}`,
        refresh_token: `demo-refresh-${demoUserId}`,
        user: {
          id: demoUserId,
          email: demoUser.email
        }
      };
      
      // @ts-ignore - Ignoramos error de tipado para la sesión simulada
      setSession(mockSession);
      
      return;
    } catch (error) {
      console.error("Error al simular inicio de sesión:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout, simulateDemoLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
