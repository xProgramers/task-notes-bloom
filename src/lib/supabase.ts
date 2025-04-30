
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Usando os valores hardcoded da integração do Supabase
const supabaseUrl = "https://pvhtwpigjjpagogvzgpd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2aHR3cGlnampwYWdvZ3Z6Z3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NjM0MzcsImV4cCI6MjA2MTUzOTQzN30.RkMaUBAddssTK5JSB5o1UMMX8UqiXBaDSAzRF1ChYGI";

// Criar e exportar o cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Esta função não é mais necessária pois estamos usando valores hardcoded
export function isSupabaseConfigured(): boolean {
  return true; // Sempre retorna true já que estamos usando valores hardcoded
}
