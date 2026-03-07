import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tbrqkcufpjtmlzypytqz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRicnFrY3VmcGp0bWx6eXB5dHF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTc3NTUsImV4cCI6MjA4ODM5Mzc1NX0.w8JT5qD9_qr1jgESuUovs2dJQQUKIGG_QbMRQHToU0I';

/**
 * Create a Supabase client for server-side API routes.
 * Reads the access token from the request Authorization header or cookie.
 */
export function createServerClient(req?: Request) {
  const accessToken = getAccessToken(req);

  if (accessToken) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function getAccessToken(req?: Request): string | null {
  if (!req) return null;

  // Check Authorization header first
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Check cookie
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/sb-access-token=([^;]+)/);
  if (match) return match[1];

  return null;
}
