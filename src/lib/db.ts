import {createClient, type Client} from '@libsql/client';
import {defaultConstructorInfo, type ConstructorInfo} from '@/lib/constructor';
import {mockServices, type ServiceItem} from '@/lib/mockData';

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
        `CREATE TABLE IF NOT EXISTS payments (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, external_reference TEXT NOT NULL UNIQUE, preference_id TEXT, provider_payment_id TEXT UNIQUE, amount REAL NOT NULL, status TEXT NOT NULL, method TEXT, description TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`,
      ]);
      await client.execute({
        sql: 'INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)',
        args: ['constructor', JSON.stringify(defaultConstructorInfo)],
      });
    })();
  }
  await schemaPromise;
}

export type PaymentRecord = {
  id: string;
  amount: number;
  status: string;
  method: string | null;
  description: string;
  created_at: string;
};

export async function createPayment(payment: {
  id: string;
  userId: string;
  externalReference: string;
  amount: number;
  description: string;
}): Promise<void> {
  const database = getDatabase();
  await ensureDatabase();
  await database.execute({
    sql: `INSERT INTO payments (id, user_id, external_reference, amount, status, description) VALUES (?, ?, ?, ?, 'pending', ?)`,
    args: [payment.id, payment.userId, payment.externalReference, payment.amount, payment.description],
  });
}

export async function setPaymentPreference(id: string, preferenceId: string): Promise<void> {
  const database = getDatabase();
  await database.execute({sql: 'UPDATE payments SET preference_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', args: [preferenceId, id]});
}

export async function listPaymentsForUser(userId: string): Promise<PaymentRecord[]> {
  const database = getDatabase();
  await ensureDatabase();
  const result = await database.execute({
    sql: 'SELECT id, amount, status, method, description, created_at FROM payments WHERE user_id = ? ORDER BY created_at DESC',
    args: [userId],
  });
  return result.rows.map(row => ({
    id: String(row.id),
    amount: Number(row.amount),
    status: String(row.status),
    method: row.method == null ? null : String(row.method),
    description: String(row.description),
    created_at: String(row.created_at),
  }));
}

export async function updatePaymentFromProvider(data: {
  providerPaymentId: string;
  externalReference: string;
  status: string;
  method: string | null;
}): Promise<void> {
  const database = getDatabase();
  await ensureDatabase();
  await database.execute({
    sql: `UPDATE payments SET provider_payment_id = ?, status = ?, method = ?, updated_at = CURRENT_TIMESTAMP WHERE external_reference = ?`,
    args: [data.providerPaymentId, data.status, data.method, data.externalReference],
  });
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

export type PaymentSettings = {
  rentAmount: number;
  rentDueDay: number;
  services: Array<Pick<ServiceItem, 'id' | 'name' | 'description' | 'price'> & {active: boolean}>;
};

export const defaultPaymentSettings: PaymentSettings = {
  rentAmount: 1,
  rentDueDay: 5,
  services: mockServices.map(({id, name, description}) => ({id, name, description, price: 1, active: true})),
};

export async function getPaymentSettings(): Promise<PaymentSettings> {
  if (!client) return defaultPaymentSettings;
  await ensureDatabase();
  const result = await client.execute({sql: 'SELECT value FROM app_settings WHERE key = ?', args: ['payments']});
  const value = result.rows[0]?.value;
  if (typeof value !== 'string') return defaultPaymentSettings;
  try {
    const parsed = JSON.parse(value) as Partial<PaymentSettings>;
    return {
      rentAmount: Number(parsed.rentAmount) > 0 ? Number(parsed.rentAmount) : defaultPaymentSettings.rentAmount,
      rentDueDay: Number(parsed.rentDueDay) >= 1 && Number(parsed.rentDueDay) <= 28 ? Number(parsed.rentDueDay) : defaultPaymentSettings.rentDueDay,
      services: Array.isArray(parsed.services) ? parsed.services.map(service => ({...service, active: service.active !== false})) : defaultPaymentSettings.services,
    };
  } catch {
    return defaultPaymentSettings;
  }
}

export async function savePaymentSettings(settings: PaymentSettings): Promise<void> {
  const database = getDatabase();
  await ensureDatabase();
  await database.execute({
    sql: `INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    args: ['payments', JSON.stringify(settings)],
  });
}