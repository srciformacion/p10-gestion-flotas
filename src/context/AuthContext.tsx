
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
    // Establecer el listener para cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        
        // Actualizar el usuario con su rol
        if (currentSession?.user) {
          setTimeout(async () => {
            try {
              // Obtener el perfil del usuario de la tabla profiles
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('role, full_name')
                .eq('id', currentSession.user.id)
                .single();
              
              if (error) throw error;
              
              // Combinar datos de usuario con su rol y nombre para crear un objeto User compatible
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: profile?.full_name || '',
                role: profile?.role as UserRole
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
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        // Si hay sesión, cargar datos del perfil
        if (currentSession?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', currentSession.user.id)
            .single();
          
          if (error) throw error;
          
          // Asegurar que el usuario cumple con la interfaz User
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            name: profile?.full_name || '',
            role: profile?.role as UserRole
          });
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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
