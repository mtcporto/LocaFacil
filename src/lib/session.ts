import {jwtVerify} from 'jose/jwt/verify';
import {SignJWT} from 'jose/jwt/sign';

const sessionSecret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'locafacil-development-secret-change-me'
);

export type Session = {
  userId: string;
  role: 'landlord' | 'tenant';
  email: string;
};

export async function createSessionToken(session: Session): Promise<string> {
  return new SignJWT(session)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(sessionSecret);
}

export async function verifySessionToken(token: string): Promise<Session | null> {
  try {
    const {payload} = await jwtVerify(token, sessionSecret);
    if (typeof payload.userId !== 'string' || typeof payload.email !== 'string') return null;
    if (payload.role !== 'landlord' && payload.role !== 'tenant') return null;
    return {userId: payload.userId, email: payload.email, role: payload.role};
  } catch {
    return null;
  }
}