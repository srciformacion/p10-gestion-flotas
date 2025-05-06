
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    // Esta función ya no necesita simular la verificación de credenciales
    // ya que usamos la autenticación real de Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Usuario no encontrado');
      }

      // Obtener el perfil completo del usuario
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) throw profileError;
      
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile?.full_name || '',
        role: profile?.role as UserRole
      };
      
      return user;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session?.user) {
        return null;
      }
      
      // Obtener el perfil del usuario
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.session.user.id)
        .single();
      
      if (error) throw error;
      
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
