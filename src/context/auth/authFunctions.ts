
import { supabase } from "@/integrations/supabase/client";
import { UserRole, User } from '@/types';
import { toast } from "@/components/ui/sonner";
import { authApi } from '@/services/api/auth';

export const loginUser = async (email: string, password: string): Promise<void> => {
  try {
    console.log('Attempting login for:', email);
    await authApi.login(email, password);
    // Session and user will be updated automatically with onAuthStateChange listener
    return;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error; // Propagate error to be handled in the component
  }
};

export const registerUser = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
  try {
    await authApi.register(name, email, password, role);
    return;
  } catch (error: any) {
    toast.error("Registration error", {
      description: error.message || "Could not complete registration"
    });
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await authApi.logout();
    // Session and user will be updated automatically with onAuthStateChange listener
  } catch (error: any) {
    console.error("Logout error:", error);
    toast.error("Logout error", {
      description: error.message
    });
  }
};

export const simulateDemoLogin = (setUser: (user: User) => void, setSession: (session: any) => void) => {
  return async (role: UserRole): Promise<void> => {
    try {
      // Generate a unique ID for the simulated user
      const demoUserId = `demo-${role}-${Date.now()}`;
      
      // Create a demo user based on the role
      const demoUser: User = {
        id: demoUserId,
        email: `${role}@demo.ambulink.com`,
        name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        role: role
      };
      
      console.log('Simulating login for:', demoUser);
      
      // Update authentication state
      setUser(demoUser);
      
      // No real session for demo, but create a similar object
      const mockSession = {
        access_token: `demo-token-${demoUserId}`,
        refresh_token: `demo-refresh-${demoUserId}`,
        user: {
          id: demoUserId,
          email: demoUser.email
        }
      };
      
      // @ts-ignore - Ignore type error for simulated session
      setSession(mockSession);
      
      toast.success(`Sesión iniciada como ${role}`, {
        description: "Acceso a demostración habilitado"
      });
      
      return;
    } catch (error) {
      console.error("Error simulating login:", error);
      throw error;
    }
  };
};
