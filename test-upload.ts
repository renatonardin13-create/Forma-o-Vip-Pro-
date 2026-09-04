import { supabase, isSupabaseConfigured } from './src/services/supabase';

async function test() {
  console.log('isSupabaseConfigured:', isSupabaseConfigured());
  const { data, error } = await supabase.auth.getSession();
  console.log('Session Error:', error);
  console.log('Session:', data?.session);
}
test();
