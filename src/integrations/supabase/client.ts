
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nddralgioxmoljjlbsgr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZHJhbGdpb3htb2xqamxic2dyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MTM2ODMsImV4cCI6MjA2MDk4OTY4M30.nilu22QGKex2rmlL6tqgGth2uHiFKmusGbD72tX7hYY";

// Configuración mejorada para resolver problemas de autenticación
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: 'ambulink-auth',
      storage: localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
);
