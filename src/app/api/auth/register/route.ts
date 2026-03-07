import { supabase } from '@/lib/supabase/client';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caracteres'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caracteres'),
});

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { message: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          name,
          plan: 'free',
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return Response.json(
          { message: 'Un compte avec cet email existe deja' },
          { status: 409 },
        );
      }
      return Response.json(
        { message: error.message },
        { status: 400 },
      );
    }

    const user = data.user;
    const session = data.session;

    return Response.json({
      user: {
        id: user?.id,
        name,
        email: user?.email,
        plan: 'free',
      },
      access_token: session?.access_token,
      refresh_token: session?.refresh_token,
    }, { status: 201 });
  } catch (err) {
    console.error('[Bokari Auth] Register error:', err);
    return Response.json(
      { message: 'Erreur lors de la creation du compte' },
      { status: 500 },
    );
  }
};
