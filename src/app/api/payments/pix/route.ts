import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getCurrentSession} from '@/lib/auth';
import {createPayment, getPaymentSettings, updatePaymentFromProvider} from '@/lib/db';

const pixSchema = z.discriminatedUnion('kind', [
  z.object({kind: z.literal('rent')}),
  z.object({kind: z.literal('services'), items: z.array(z.object({id: z.string().min(1), quantity: z.number().int().positive().max(100)})).min(1)}),
]);

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (session?.role !== 'tenant') return NextResponse.json({error: 'Não autorizado.'}, {status: 401});
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) return NextResponse.json({error: 'Mercado Pago não configurado.'}, {status: 503});
  const parsed = pixSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error: 'Dados de pagamento inválidos.'}, {status: 400});

  const settings = await getPaymentSettings();
  const services = parsed.data.kind === 'services'
    ? parsed.data.items.map(item => {
        const service = settings.services.find(configured => configured.id === item.id && configured.active);
        return service ? {...service, quantity: item.quantity} : null;
      })
    : [];
  if (parsed.data.kind === 'services' && services.some(service => !service)) return NextResponse.json({error: 'Um dos serviços não está disponível.'}, {status: 400});
  const amount = parsed.data.kind === 'rent' ? settings.rentAmount : services.reduce((total, service) => total + (service?.price || 0) * (service?.quantity || 0), 0);
  const description = parsed.data.kind === 'rent' ? 'Aluguel mensal - LocaFácil' : 'Serviços adicionais - LocaFácil';
  const paymentId = crypto.randomUUID();
  const externalReference = `locafacil:${paymentId}:${session.userId}`;
  await createPayment({amount, description, id: paymentId, userId: session.userId, externalReference});

  const response = await fetch('https://api.mercadopago.com/v1/payments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      'X-Idempotency-Key': paymentId,
    },
    body: JSON.stringify({
      transaction_amount: amount,
      description,
      payment_method_id: 'pix',
      external_reference: externalReference,
      notification_url: `${new URL(request.url).origin}/api/payments/mercadopago/webhook`,
      payer: {email: session.email},
    }),
  });
  if (!response.ok) return NextResponse.json({error: 'Não foi possível gerar o PIX.'}, {status: 502});
  const payment = await response.json() as {id?: number; status?: string; point_of_interaction?: {transaction_data?: {qr_code?: string; qr_code_base64?: string; ticket_url?: string}}};
  const transactionData = payment.point_of_interaction?.transaction_data;
  if (!payment.id || !transactionData?.qr_code) return NextResponse.json({error: 'Resposta PIX inválida.'}, {status: 502});
  await updatePaymentFromProvider({providerPaymentId: String(payment.id), externalReference, status: payment.status || 'pending', method: 'pix'});
  return NextResponse.json({paymentId: String(payment.id), status: payment.status, qrCode: transactionData.qr_code, qrCodeBase64: transactionData.qr_code_base64, ticketUrl: transactionData.ticket_url});
}
