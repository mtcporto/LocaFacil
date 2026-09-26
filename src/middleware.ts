import {NextRequest, NextResponse} from 'next/server';
import {verifySessionToken} from '@/lib/session';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const role = pathname.startsWith('/landlord/') ? 'landlord' : 'tenant';
  const token = request.cookies.get('locafacil_session')?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session || session.role !== role) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/landlord/:path*', '/tenant/:path*'],
};