
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Using hardcoded values from the Supabase integration
const supabaseUrl = "https://pvhtwpigjjpagogvzgpd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2aHR3cGlnampwYWdvZ3Z6Z3BkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NjM0MzcsImV4cCI6MjA2MTUzOTQzN30.RkMaUBAddssTK5JSB5o1UMMX8UqiXBaDSAzRF1ChYGI";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// This function is no longer needed as we have hardcoded values
export function isSupabaseConfigured(): boolean {
  return true; // Always return true since we're using hardcoded values
}
