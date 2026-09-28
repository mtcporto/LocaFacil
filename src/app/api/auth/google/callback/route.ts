import {NextResponse} from 'next/server';
import {authenticateGoogleUser, createSessionToken, SESSION_COOKIE} from '@/lib/auth';

const STATE_COOKIE = 'locafacil_google_state';

type GoogleUser = {email?: string; name?: string; verified_email?: boolean};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  const stateCookie = request.headers.get('cookie')?.match(new RegExp(`${STATE_COOKIE}=([^;]+)`))?.[1];
  if (!code || !state || !stateCookie || state !== stateCookie) {
    return NextResponse.redirect(new URL('/auth/login?error=google_state', request.url));
  }
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(new URL('/auth/login?error=google_not_configured', request.url));
  }

  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${requestUrl.origin}/api/auth/google/callback`;
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenResponse.ok) return NextResponse.redirect(new URL('/auth/login?error=google_token', request.url));
  const tokens = await tokenResponse.json() as {access_token?: string};
  if (!tokens.access_token) return NextResponse.redirect(new URL('/auth/login?error=google_token', request.url));

  const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {Authorization: `Bearer ${tokens.access_token}`},
  });
  if (!userResponse.ok) return NextResponse.redirect(new URL('/auth/login?error=google_user', request.url));
  const googleUser = await userResponse.json() as GoogleUser;
  if (!googleUser.email || googleUser.verified_email === false) return NextResponse.redirect(new URL('/auth/login?error=google_email', request.url));

  const session = await authenticateGoogleUser(googleUser.email, googleUser.name || googleUser.email);
  if (!session) return NextResponse.redirect(new URL('/auth/login?error=google_account', request.url));
  const response = NextResponse.redirect(new URL(session.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard', request.url));
  response.cookies.set(SESSION_COOKIE, await createSessionToken(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.delete(STATE_COOKIE);
  return response;
}