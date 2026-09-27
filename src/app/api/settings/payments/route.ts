import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getCurrentSession} from '@/lib/auth';
import {getPaymentSettings, savePaymentSettings} from '@/lib/db';

const paymentSettingsSchema = z.object({
  rentAmount: z.number().positive().max(100000),
  rentDueDay: z.number().int().min(1).max(28),
  services: z.array(z.object({id: z.string().min(1), name: z.string().min(1).max(80), description: z.string().max(240), price: z.number().positive().max(100000), active: z.boolean()})).max(50),
});

export async function GET() {
  return NextResponse.json(await getPaymentSettings());
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (session?.role !== 'landlord') return NextResponse.json({error: 'Não autorizado.'}, {status: 401});
  const parsed = paymentSettingsSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error: 'Revise os valores e serviços informados.'}, {status: 400});
  await savePaymentSettings(parsed.data);
  return NextResponse.json(parsed.data);
}