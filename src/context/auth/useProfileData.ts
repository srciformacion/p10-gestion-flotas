
import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js'; // Session removed as not used
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
      
      // Check if this is a demo user based on the metadata flag
      if (supUser.user_metadata?._isDemo) {
        // console.log('Detected demo user in useProfileData:', supUser);
        setUser({
          id: supUser.id,
          email: supUser.email || '',
          name: supUser.user_metadata.name as string,
          role: supUser.user_metadata.role as UserRole,
        });
        return; // Skip database call for demo users
      }
      
      // Proceed with database query for real users
      try {
        // Obtain the profile of the user from the table profiles
        // console.log('Fetching profile for real user:', supUser.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, full_name')
          .eq('id', supUser.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading profile:', error);
          // Set user to null or a minimal user object if profile fetch fails
          setUser({
            id: supUser.id,
            email: supUser.email || '',
            name: 'Error Profile', // Indicate profile loading error
            role: 'individual' // Default or fallback role
          });
          return;
        }
        
        if (!profile) {
          console.warn('Profile not found for user:', supUser.id);
          // Handle case where profile doesn't exist for a supposedly real user
           setUser({
            id: supUser.id,
            email: supUser.email || '',
            name: supUser.email || 'Usuario sin perfil', // Default name
            role: 'individual' // Default role
          });
          return;
        }
        
        // Combine user data with their role and name to create a User-compatible object
        setUser({
          id: supUser.id,
          email: supUser.email || '',
          name: profile.full_name || '',
          role: (profile.role as UserRole) || 'individual'
        });
      } catch (error) {
        console.error('Error loading profile (catch block):', error);
        setUser(null); // Fallback to null on unexpected error
      }
    };

    loadUserProfile();
  }, [supUser]);

  return user;
};

