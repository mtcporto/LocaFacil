import {NextResponse} from 'next/server';
import {z} from 'zod';
import {createHash} from 'node:crypto';
import {authenticate, createSessionToken, SESSION_COOKIE} from '@/lib/auth';
import {checkLoginRateLimit, clearLoginRateLimit, recordLoginFailure} from '@/lib/db';

const loginSchema = z.object({email: z.string().email(), password: z.string().min(6)});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error: 'Email ou senha inválidos.'}, {status: 400});

  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const clientAddress = forwardedFor || request.headers.get('x-real-ip') || 'unknown';
  const rateLimitKey = createHash('sha256').update(`${parsed.data.email.toLowerCase()}|${clientAddress}`).digest('hex');
  const rateLimitEnabled = Boolean(process.env.TURSO_DATABASE_URL);
  const rateLimit = rateLimitEnabled ? await checkLoginRateLimit(rateLimitKey) : {blocked: false, retryAfterSeconds: 0};
  if (rateLimit.blocked) {
    return NextResponse.json({error: 'Muitas tentativas. Tente novamente mais tarde.'}, {
      status: 429,
      headers: {'Retry-After': String(rateLimit.retryAfterSeconds)},
    });
  }

  const session = await authenticate(parsed.data.email, parsed.data.password);
  if (!session) {
    if (rateLimitEnabled) await recordLoginFailure(rateLimitKey);
    return NextResponse.json({error: 'Email ou senha inválidos.'}, {status: 401});
  }
  if (rateLimitEnabled) await clearLoginRateLimit(rateLimitKey);

  const response = NextResponse.json({role: session.role});
  response.cookies.set(SESSION_COOKIE, await createSessionToken(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}