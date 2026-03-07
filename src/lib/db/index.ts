/**
 * Database module - now powered by Supabase PostgreSQL
 * This file provides backward-compatible helpers used by existing code.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tbrqkcufpjtmlzypytqz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicnFrY3VmcGp0bWx6eXB5dHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTc3NTUsImV4cCI6MjA4ODM5Mzc1NX0.w8JT5qD9_qr1jgESuUovs2dJQQUKIGG_QbMRQHToU0I';

// Server-side client with service role for bypassing RLS in agents
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;
export const initDb = async () => { /* no-op for Supabase */ };
export function saveDatabase() { /* no-op for Supabase */ }
