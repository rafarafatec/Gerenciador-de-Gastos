import { createClient } from '@supabase/supabase-js';

// Utiliza as variáveis de ambiente injetadas pelo Vite
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Inicializa o cliente Supabase somente se as variáveis estiverem presentes
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const isSupabaseConfigured = () => !!supabase;