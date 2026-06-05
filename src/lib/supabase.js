import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL
  || import.meta.env.VITE_SUPABASE_PROJECT_URL
  || import.meta.env.SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  || import.meta.env.VITE_SUPABASE_KEY
  || import.meta.env.VITE_SUPABASE_PUBLIC_KEY
  || import.meta.env.SUPABASE_ANON_KEY;

// Returns null when env vars are missing (dev without credentials)
export const supabase = url && key ? createClient(url, key) : null;

export const isSupabaseEnabled = Boolean(supabase);
