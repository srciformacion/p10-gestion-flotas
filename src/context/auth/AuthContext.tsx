
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { UserRole, User } from '@/types';
import { AuthContextType } from './types';
import { loginUser, registerUser, logoutUser, simulateDemoLogin } from './authFunctions';
import { useProfileData } from './useProfileData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [supUser, setSupUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  const user = useProfileData(supUser);

  useEffect(() => {
    console.log('Initializing AuthContext');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth event:', event, currentSession);
        setSession(currentSession);
        setSupUser(currentSession?.user || null);
      }
    );

    const checkSession = async () => {
      try {
        console.log('Checking for existing session');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setSupUser(currentSession?.user || null);
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Authentication functions
  const login = async (email: string, password: string) => {
    return loginUser(email, password);
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    return registerUser(name, email, password, role);
  };

  const logout = async () => {
    // Clear supUser and session immediately for demo users
    if (supUser?.id?.startsWith('demo-')) {
      setSupUser(null);
      setSession(null);
      // Optionally, call the actual logoutUser if it clears other necessary states
      // await logoutUser(); 
      return;
    }
    return logoutUser();
  };

  // Demo login functionality
  const handleSimulateDemoLogin = simulateDemoLogin(
    (demoUserFromAuthFunctions: User) => { // This is the User object with id, email, name, role
      const demoSupabaseUser: SupabaseUser = {
        id: demoUserFromAuthFunctions.id,
        email: demoUserFromAuthFunctions.email,
        user_metadata: {
          // Store the necessary profile fields here
          _isDemo: true, // Flag to identify demo user
          name: demoUserFromAuthFunctions.name,
          role: demoUserFromAuthFunctions.role,
        },
        // Mock other required fields for SupabaseUser type compatibility
        app_metadata: { provider: 'email', providers: ['email'] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        // Add other fields if they are accessed or cause type errors
        // identities: [], // Example if needed
        // phone: '', // Example if needed
      };
      // console.log('Setting demo SupabaseUser:', demoSupabaseUser);
      setSupUser(demoSupabaseUser);
    },
    setSession // This sets a mock session object
  );

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      login, 
      register, 
      logout, 
      simulateDemoLogin: handleSimulateDemoLogin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

