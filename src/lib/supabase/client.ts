import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tbrqkcufpjtmlzypytqz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicnFrY3VmcGp0bWx6eXB5dHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTc3NTUsImV4cCI6MjA4ODM5Mzc1NX0.w8JT5qD9_qr1jgESuUovs2dJQQUKIGG_QbMRQHToU0I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
