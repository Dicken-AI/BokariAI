import crypto from 'crypto';

const SECRET = process.env.AUTH_SECRET || 'bokari-secret-key-change-in-production-2026';
const TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  exp: number;
}

function sign(payload: string): string {
  const hmac = crypto.createHmac('sha256', SECRET);
  hmac.update(payload);
  return hmac.digest('hex');
}

export function createSessionToken(user: { id: string; email: string; name: string }): string {
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    exp: Date.now() + TOKEN_EXPIRY,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = sign(data);
  return `${data}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;

    const expectedSignature = sign(data);
    if (signature !== expectedSignature) return null;

    const payload: SessionPayload = JSON.parse(
      Buffer.from(data, 'base64url').toString('utf-8'),
    );

    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(req: Request): SessionPayload | null {
  const cookie = req.headers.get('cookie') || '';
  const match = cookie.match(/bokari_session=([^;]+)/);
  if (!match) return null;
  return verifySessionToken(match[1]);
}

export function createSessionCookie(token: string): string {
  return `bokari_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`;
}

export function createLogoutCookie(): string {
  return 'bokari_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}
