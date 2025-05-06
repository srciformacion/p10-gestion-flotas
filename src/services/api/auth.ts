
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      console.log('Intentando iniciar sesión con:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Error de autenticación:', error);
        throw error;
      }
      
      if (!data.user) {
        console.error('Usuario no encontrado en respuesta');
        throw new Error('Usuario no encontrado');
      }

      // Obtener el perfil completo del usuario
      console.log('Usuario autenticado, obteniendo perfil para:', data.user.id);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.error('Error obteniendo perfil:', profileError);
        throw profileError;
      }
      
      if (!profile) {
        console.error('Perfil no encontrado para usuario:', data.user.id);
        throw new Error('Perfil de usuario no encontrado');
      }
      
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile?.full_name || '',
        role: profile?.role as UserRole
      };
      
      console.log('Login exitoso para usuario:', user);
      return user;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error en logout:', error);
        throw error;
      }
      console.log('Logout exitoso');
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      console.log('Verificando sesión actual');
      const { data } = await supabase.auth.getSession();
      
      if (!data.session?.user) {
        console.log('No hay sesión activa');
        return null;
      }
      
      // Obtener el perfil del usuario
      console.log('Obteniendo perfil para usuario activo:', data.session.user.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.session.user.id)
        .single();
      
      if (error) {
        console.error('Error obteniendo perfil:', error);
        throw error;
      }
      
      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        name: profile?.full_name || '',
        role: profile?.role as UserRole
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  register: async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role,
          }
        }
      });
      
      if (error) throw error;
      if (!data.user) throw new Error('Error al crear usuario');
      
      // En un ambiente de producción, es posible que necesites esperar a que el usuario confirme su email
      // En este caso, asumimos que se crea el perfil inmediatamente gracias al trigger en la base de datos
      
      return {
        id: data.user.id,
        email: data.user.email || '',
        name,
        role
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }
};
