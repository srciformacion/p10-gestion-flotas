
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
  
  // Get user profile data based on the Supabase user
  const user = useProfileData(supUser);

  useEffect(() => {
    console.log('Initializing AuthContext');
    
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth event:', event);
        setSession(currentSession);
        setSupUser(currentSession?.user || null);
      }
    );

    // Check for an existing session on load
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
    return logoutUser();
  };

  // Demo login functionality
  const handleSimulateDemoLogin = simulateDemoLogin(
    (demoUser: User) => user !== demoUser && setSupUser({ id: demoUser.id, email: demoUser.email } as SupabaseUser),
    setSession
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
