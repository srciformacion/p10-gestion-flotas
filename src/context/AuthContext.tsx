
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { UserRole, User } from '@/types';
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Error de autenticación en login:', error);
        throw error;
      }
      
      if (!data.user) {
        console.error('Usuario no encontrado en respuesta de login');
        throw new Error('Usuario no encontrado');
      }

      console.log('Login exitoso para:', data.user.email);
      return;
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      throw error; // Propagamos el error para manejarlo en el componente Login
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          }
        }
      });

      if (error) throw error;

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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // La sesión y el usuario se actualizarán automáticamente con el listener onAuthStateChange
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión", {
        description: error.message
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout }}>
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
