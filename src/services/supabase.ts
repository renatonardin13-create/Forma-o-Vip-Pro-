import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any)?.env || (typeof process !== 'undefined' ? process.env : {});
const supabaseUrl = env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY || 'placeholder';

/**
 * Helper to check if Supabase is properly configured
 */
export const isSupabaseConfigured = () => {
  const url = env?.VITE_SUPABASE_URL;
  const key = env?.VITE_SUPABASE_ANON_KEY;
  return !!(url && key && url.startsWith('https://') && url !== 'https://placeholder.supabase.co');
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
