export const register = async () => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Supabase handles database - no local migrations needed
    console.log('Bokari: Using Supabase for database and auth');

    await import('./lib/config/index');
  }
};
