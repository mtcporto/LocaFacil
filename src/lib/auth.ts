import {cookies} from 'next/headers';
import {randomBytes, pbkdf2Sync, timingSafeEqual} from 'node:crypto';
import {getDatabase, ensureDatabase} from '@/lib/db';
import {createSessionToken, verifySessionToken, type Session} from '@/lib/session';

const SESSION_COOKIE = 'locafacil_session';

function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const hash = pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function passwordMatches(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const candidate = pbkdf2Sync(password, salt, 120000, 64, 'sha512');
  return timingSafeEqual(candidate, Buffer.from(hash, 'hex'));
}

async function provisionConfiguredUser(email: string, password: string) {
  const configured = [
    {email: process.env.LANDLORD_EMAIL, password: process.env.LANDLORD_PASSWORD, role: 'landlord' as const, displayName: 'Proprietário'},
    {email: process.env.TENANT_EMAIL, password: process.env.TENANT_PASSWORD, role: 'tenant' as const, displayName: 'Inquilino'},
  ].find(user => user.email?.toLowerCase() === email.toLowerCase() && user.password === password);

  if (!configured) return null;
  const database = getDatabase();
  const userId = `${configured.role}-${Buffer.from(email).toString('hex').slice(0, 20)}`;
  await database.execute({
    sql: `INSERT INTO users (id, email, password_hash, role, display_name) VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role`,
    args: [userId, email.toLowerCase(), hashPassword(password), configured.role, configured.displayName],
  });
  return {userId, email: email.toLowerCase(), role: configured.role} satisfies Session;
}

export async function authenticateGoogleUser(email: string, displayName: string): Promise<Session | null> {
  await ensureDatabase();
  if (!process.env.TURSO_DATABASE_URL) return null;
  const database = getDatabase();
  const normalizedEmail = email.toLowerCase();
  const existing = await database.execute({sql: 'SELECT id, email, role FROM users WHERE email = ?', args: [normalizedEmail]});
  const user = existing.rows[0];
  if (user && typeof user.id === 'string' && typeof user.email === 'string' && (user.role === 'landlord' || user.role === 'tenant')) {
    return {userId: user.id, email: user.email, role: user.role};
  }

  const configuredRole = process.env.LANDLORD_EMAIL?.toLowerCase() === normalizedEmail
    ? 'landlord'
    : 'tenant';
  const userId = `google-${Buffer.from(normalizedEmail).toString('hex').slice(0, 24)}`;
  await database.execute({
    sql: 'INSERT INTO users (id, email, password_hash, role, display_name) VALUES (?, ?, ?, ?, ?)',
    args: [userId, normalizedEmail, hashPassword(randomBytes(32).toString('hex')), configuredRole, displayName || normalizedEmail],
  });
  return {userId, email: normalizedEmail, role: configuredRole};
}

export async function authenticate(email: string, password: string): Promise<Session | null> {
  await ensureDatabase();
  if (!process.env.TURSO_DATABASE_URL) return null;
  const database = getDatabase();
  const result = await database.execute({sql: 'SELECT id, email, password_hash, role FROM users WHERE email = ?', args: [email.toLowerCase()]});
  const user = result.rows[0];
  if (user && typeof user.id === 'string' && typeof user.email === 'string' && typeof user.password_hash === 'string' && (user.role === 'landlord' || user.role === 'tenant') && passwordMatches(password, user.password_hash)) {
    return {userId: user.id, email: user.email, role: user.role};
  }
  return provisionConfiguredUser(email, password);
}

export async function getCurrentSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export {SESSION_COOKIE, createSessionToken};