import { createServerClient } from '@/lib/supabase/server';

export const GET = async (req: Request) => {
  try {
    const supabase = createServerClient(req);
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return Response.json({ user: null }, { status: 200 });
    }

    return Response.json({
      user: {
        id: user.id,
        name: user.user_metadata?.name || '',
        email: user.email,
        plan: user.user_metadata?.plan || 'free',
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    console.error('[Bokari Auth] Me error:', err);
    return Response.json({ user: null }, { status: 200 });
  }
};
