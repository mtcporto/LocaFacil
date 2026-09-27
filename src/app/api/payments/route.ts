import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getCurrentSession} from '@/lib/auth';
import {createPayment, getPaymentSettings, listPaymentsForUser, setPaymentPreference, updatePaymentFromProvider} from '@/lib/db';

const createPaymentSchema = z.discriminatedUnion('kind', [
  z.object({kind: z.literal('rent')}),
  z.object({kind: z.literal('iptu')}),
  z.object({kind: z.literal('tcr')}),
  z.object({kind: z.literal('services'), items: z.array(z.object({id: z.string().min(1), quantity: z.number().int().positive().max(100)})).min(1)}),
]);

export async function GET() {
  const session = await getCurrentSession();
  if (session?.role !== 'tenant') return NextResponse.json({error: 'Não autorizado.'}, {status: 401});
  const payments = await listPaymentsForUser(session.userId);
  if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
    await Promise.all(payments.filter(payment => payment.provider_payment_id && ['pending', 'in_process'].includes(payment.status)).map(async payment => {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(payment.provider_payment_id as string)}`, {
        headers: {Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`},
        cache: 'no-store',
      }).catch(() => null);
      if (!response?.ok) return;
      const providerPayment = await response.json().catch(() => null) as {status?: string; payment_method_id?: string} | null;
      if (providerPayment?.status) {
        await updatePaymentFromProvider({providerPaymentId: payment.provider_payment_id as string, externalReference: `locafacil:${payment.id}:${session.userId}`, status: providerPayment.status, method: providerPayment.payment_method_id || payment.method});
      }
    }));
  }
  return NextResponse.json({payments: await listPaymentsForUser(session.userId)});
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (session?.role !== 'tenant') return NextResponse.json({error: 'Não autorizado.'}, {status: 401});
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) return NextResponse.json({error: 'Mercado Pago não configurado.'}, {status: 503});

  const parsed = createPaymentSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error: 'Dados de pagamento inválidos.'}, {status: 400});
  const settings = await getPaymentSettings();
  const services = parsed.data.kind === 'services'
    ? parsed.data.items.map(item => {
        const service = settings.services.find(configured => configured.id === item.id && configured.active);
        return service ? {...service, quantity: item.quantity} : null;
      })
    : [];
  if (parsed.data.kind === 'services' && services.some(service => !service)) return NextResponse.json({error: 'Um dos serviços não está disponível.'}, {status: 400});
  const amount = parsed.data.kind === 'rent'
    ? settings.rentAmount
    : parsed.data.kind === 'iptu'
      ? settings.iptuAmount
      : parsed.data.kind === 'tcr'
        ? settings.tcrAmount
    : services.reduce((total, service) => total + (service?.price || 0) * (service?.quantity || 0), 0);
  const description = parsed.data.kind === 'rent'
    ? 'Aluguel mensal - LocaFácil'
    : parsed.data.kind === 'iptu'
      ? 'IPTU - LocaFácil'
      : parsed.data.kind === 'tcr'
        ? 'TCR - LocaFácil'
        : `Serviços: ${services.map(service => service?.name).filter(Boolean).join(', ')}`;

  const paymentId = crypto.randomUUID();
  const externalReference = `locafacil:${paymentId}:${session.userId}`;
  await createPayment({amount, description, id: paymentId, userId: session.userId, externalReference});

  const origin = new URL(request.url).origin;
  const preferenceResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`},
    body: JSON.stringify({
      items: [{id: paymentId, title: description, quantity: 1, currency_id: 'BRL', unit_price: amount}],
      payment_methods: {excluded_payment_types: [], installments: 12},
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