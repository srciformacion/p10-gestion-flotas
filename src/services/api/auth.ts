
import { User, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      console.log('[AUTH SERVICE] Iniciando sesión con:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('[AUTH SERVICE] Error de autenticación:', error);
        throw error;
      }
      
      if (!data.user) {
        console.error('[AUTH SERVICE] Usuario no encontrado en respuesta');
        throw new Error('Usuario no encontrado');
      }

      console.log('[AUTH SERVICE] Sesión creada correctamente:', data.session);
      
      // Obtener el perfil completo del usuario
      console.log('[AUTH SERVICE] Obteniendo perfil para:', data.user.id);
      // Corregimos la consulta para evitar error de tipo
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .maybeSingle(); // Usamos maybeSingle en lugar de single
      
      if (profileError) {
        console.error('[AUTH SERVICE] Error obteniendo perfil:', profileError);
        throw profileError;
      }
      
      if (!profile) {
        console.error('[AUTH SERVICE] Perfil no encontrado para usuario:', data.user.id);
        throw new Error('Perfil de usuario no encontrado');
      }
      
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile?.full_name || '',
        role: (profile?.role as UserRole) || 'individual' // Valor predeterminado si no hay rol
      };
      
      console.log('[AUTH SERVICE] Login exitoso para usuario:', user);
      return user;
    } catch (error) {
      console.error('[AUTH SERVICE] Error en login:', error);
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
      // Corregimos la consulta para evitar error de tipo
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.session.user.id)
        .maybeSingle(); // Usamos maybeSingle en lugar de single
      
      if (error) {
        console.error('Error obteniendo perfil:', error);
        throw error;
      }
      
      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        name: profile?.full_name || '',
        role: (profile?.role as UserRole) || 'individual' // Valor predeterminado si no hay rol
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  register: async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    try {
      console.log('[AUTH SERVICE] Registrando nuevo usuario:', email, 'con rol:', role);
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
      
      if (error) {
        console.error('[AUTH SERVICE] Error en registro:', error);
        throw error;
      }
      
      if (!data.user) {
        console.error('[AUTH SERVICE] Error al crear usuario');
        throw new Error('Error al crear usuario');
      }
      
      // Asegurarse de que el perfil se ha creado correctamente
      // Aunque normalmente este proceso lo realiza la función de webhook handle_new_user
      console.log('[AUTH SERVICE] Usuario creado con ID:', data.user.id);
      
      // Crear objeto de usuario para devolver
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name,
        role
      };
      
      console.log('[AUTH SERVICE] Registro exitoso para usuario:', user);
      return user;
    } catch (error) {
      console.error('[AUTH SERVICE] Error en registro:', error);
      throw error;
    }
  },
  
  createAdminUser: async (name: string, email: string, password: string): Promise<User> => {
    console.log('[AUTH SERVICE] Creando usuario administrador:', email);
    return authApi.register(name, email, password, 'admin');
  }
};
