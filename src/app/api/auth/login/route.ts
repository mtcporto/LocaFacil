import {NextResponse} from 'next/server';
import {z} from 'zod';
import {authenticate, createSessionToken, SESSION_COOKIE} from '@/lib/auth';

const loginSchema = z.object({email: z.string().email(), password: z.string().min(6)});

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error: 'Email ou senha inválidos.'}, {status: 400});
  const session = await authenticate(parsed.data.email, parsed.data.password);
  if (!session) return NextResponse.json({error: 'Email ou senha inválidos.'}, {status: 401});

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