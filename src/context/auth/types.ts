
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { UserRole, User } from '@/types';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  simulateDemoLogin: (role: UserRole) => Promise<void>;
}
