import { createClient } from '@supabase/supabase-js';

// Configuração inserida a partir do print enviado
const SUPABASE_URL = 'https://urnipmzmnkqrshkfpwgk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LHPRY8QD-0oDAR8ql6rLgw_nUvCeFpS';

// Inicializa o cliente Supabase
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const isSupabaseConfigured = () => !!supabase;