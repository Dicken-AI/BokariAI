import { supabase } from '@/lib/supabase/client';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      return Response.json(
        { message: 'Email ou mot de passe incorrect' },
        { status: 401 },
      );
    }

    const user = data.user;
    const session = data.session;

    return Response.json({
      user: {
        id: user.id,
        name: user.user_metadata?.name || '',
        email: user.email,
        plan: user.user_metadata?.plan || 'free',
      },
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  } catch (err) {
    console.error('[Bokari Auth] Login error:', err);
    return Response.json(
      { message: 'Erreur lors de la connexion' },
      { status: 500 },
    );
  }
};
