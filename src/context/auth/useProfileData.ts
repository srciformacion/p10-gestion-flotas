
import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
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
      
      if (supUser.user_metadata?._isDemo) {
        setUser({
          id: supUser.id,
          email: supUser.email || '',
          name: supUser.user_metadata.name as string,
          role: supUser.user_metadata.role as UserRole,
          vehicle_id: supUser.user_metadata.vehicle_id as string | undefined, // Added for demo user
        });
        return;
      }
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, full_name, vehicle_id') // Added vehicle_id
          .eq('id', supUser.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading profile:', error);
          setUser({
            id: supUser.id,
            email: supUser.email || '',
            name: 'Error Profile',
            role: 'individual',
            vehicle_id: undefined, // Ensure vehicle_id is part of the object
          });
          return;
        }
        
        if (!profile) {
          console.warn('Profile not found for user:', supUser.id);
           setUser({
            id: supUser.id,
            email: supUser.email || '',
            name: supUser.email || 'Usuario sin perfil',
            role: 'individual',
            vehicle_id: undefined, // Ensure vehicle_id is part of the object
          });
          return;
        }
        
        setUser({
          id: supUser.id,
          email: supUser.email || '',
          name: profile.full_name || '',
          role: (profile.role as UserRole) || 'individual',
          vehicle_id: profile.vehicle_id || undefined, // Added vehicle_id
        });
      } catch (error) {
        console.error('Error loading profile (catch block):', error);
        setUser(null);
      }
    };

    loadUserProfile();
  }, [supUser]);

  return user;
};
