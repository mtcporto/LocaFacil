import {createClient, type Client} from '@libsql/client';
import {defaultConstructorInfo, type ConstructorInfo} from '@/lib/constructor';

const client: Client | null = process.env.TURSO_DATABASE_URL
  ? createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : null;

let schemaPromise: Promise<void> | null = null;

export function getDatabase(): Client {
  if (!client) {
    throw new Error('TURSO_DATABASE_URL não está configurada.');
  }
  return client;
}

export async function ensureDatabase(): Promise<void> {
  if (!client) return;
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await client.batch([
        `CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK (role IN ('landlord', 'tenant')), display_name TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
      ]);
      await client.execute({
        sql: 'INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)',
        args: ['constructor', JSON.stringify(defaultConstructorInfo)],
      });
    })();
  }
  await schemaPromise;
}

export async function getConstructorInfo(): Promise<ConstructorInfo> {
  if (!client) return defaultConstructorInfo;
  await ensureDatabase();
  const result = await client.execute({
    sql: 'SELECT value FROM app_settings WHERE key = ?',
    args: ['constructor'],
  });
  const value = result.rows[0]?.value;
  if (typeof value !== 'string') return defaultConstructorInfo;
  try {
    return {...defaultConstructorInfo, ...JSON.parse(value)};
  } catch {
    return defaultConstructorInfo;
  }
}

export async function saveConstructorInfo(info: ConstructorInfo): Promise<void> {
  const database = getDatabase();
  await ensureDatabase();
  await database.execute({
    sql: `INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    args: ['constructor', JSON.stringify(info)],
  });
}