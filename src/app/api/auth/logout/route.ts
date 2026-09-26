import {NextResponse} from 'next/server';
import {SESSION_COOKIE} from '@/lib/auth';

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/auth/login', request.url));
  response.cookies.set(SESSION_COOKIE, '', {httpOnly: true, expires: new Date(0), path: '/'});
  return response;
}

export const POST = GET;