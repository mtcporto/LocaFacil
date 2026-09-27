import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getCurrentSession} from '@/lib/auth';
import {createPayment, listPaymentsForUser, setPaymentPreference} from '@/lib/db';

const createPaymentSchema = z.object({amount: z.number().positive().max(100000), description: z.string().min(1).max(120)});

export async function GET() {
  const session = await getCurrentSession();
  if (session?.role !== 'tenant') return NextResponse.json({error: 'Não autorizado.'}, {status: 401});
  return NextResponse.json({payments: await listPaymentsForUser(session.userId)});
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (session?.role !== 'tenant') return NextResponse.json({error: 'Não autorizado.'}, {status: 401});
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) return NextResponse.json({error: 'Mercado Pago não configurado.'}, {status: 503});

  const parsed = createPaymentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error: 'Dados de pagamento inválidos.'}, {status: 400});

  const paymentId = crypto.randomUUID();
  const externalReference = `locafacil:${paymentId}:${session.userId}`;
  await createPayment({...parsed.data, id: paymentId, userId: session.userId, externalReference});

  const origin = new URL(request.url).origin;
  const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`},
    body: JSON.stringify({
      items: [{id: paymentId, title: parsed.data.description, quantity: 1, currency_id: 'BRL', unit_price: parsed.data.amount}],
      payer: {email: session.email},
      external_reference: externalReference,
      back_urls: {success: `${origin}/tenant/payments?payment=success`, pending: `${origin}/tenant/payments?payment=pending`, failure: `${origin}/tenant/payments?payment=failure`},
      auto_return: 'approved',
      notification_url: `${origin}/api/payments/mercadopago/webhook`,
    }),
  });
  if (!preferenceResponse.ok) return NextResponse.json({error: 'Não foi possível criar o checkout.'}, {status: 502});
  const preference = await preferenceResponse.json() as {id?: string; init_point?: string};
  if (!preference.id || !preference.init_point) return NextResponse.json({error: 'Resposta inválida do Mercado Pago.'}, {status: 502});
  await setPaymentPreference(paymentId, preference.id);
  return NextResponse.json({checkoutUrl: preference.init_point});
}