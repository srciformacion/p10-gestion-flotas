
import { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { UserRole, User } from '@/types';

export const useProfileData = (supUser: SupabaseUser | null) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!supUser) {
        setUser(null);
        return;
      }
      
      try {
        // Obtain the profile of the user from the table profiles
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', supUser.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading profile:', error);
          throw error;
        }
        
        if (!profile) {
          console.warn('Profile not found for user:', supUser.id);
        }
        
        // Combine user data with their role and name to create a User-compatible object
        setUser({
          id: supUser.id,
          email: supUser.email || '',
          name: profile?.full_name || '',
          role: (profile?.role as UserRole) || 'individual' // Default value if no role
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setUser(null);
      }
    };

    loadUserProfile();
  }, [supUser]);

  return user;
};
