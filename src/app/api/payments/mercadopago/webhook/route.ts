import {NextResponse} from 'next/server';
import {updatePaymentFromProvider} from '@/lib/db';

export async function POST(request: Request) {
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) return NextResponse.json({error: 'Mercado Pago não configurado.'}, {status: 503});
  const url = new URL(request.url);
  const body = await request.json().catch(() => ({})) as {data?: {id?: string}; type?: string; action?: string};
  const paymentId = body.data?.id || url.searchParams.get('data.id');
  const type = body.type || url.searchParams.get('type');
  if (type !== 'payment' || !paymentId) return NextResponse.json({received: true});

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
    headers: {Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`},
  });
  if (response.status === 404) return NextResponse.json({received: true});
  if (!response.ok) return NextResponse.json({error: 'Falha ao consultar pagamento.'}, {status: 502});
  const payment = await response.json() as {id?: number; external_reference?: string; status?: string; payment_method_id?: string};
  if (payment.id && payment.external_reference && payment.status) {
    await updatePaymentFromProvider({providerPaymentId: String(payment.id), externalReference: payment.external_reference, status: payment.status, method: payment.payment_method_id || null});
  }
  return NextResponse.json({received: true});
}