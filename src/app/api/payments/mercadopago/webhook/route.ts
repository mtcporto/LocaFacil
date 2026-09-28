import {NextResponse} from 'next/server';
import {createHmac, timingSafeEqual} from 'node:crypto';
import {updatePaymentFromProvider} from '@/lib/db';

function hasValidSignature(request: Request, paymentId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  const signature = request.headers.get('x-signature');
  const requestId = request.headers.get('x-request-id');
  if (!secret || !signature || !requestId) return false;

  const values = Object.fromEntries(signature.split(',').map(part => {
    const [key, ...value] = part.trim().split('=');
    return [key, value.join('=')];
  }));
  const timestamp = values.ts;
  const receivedSignature = values.v1;
  if (!timestamp || !receivedSignature || !/^\d+$/.test(timestamp)) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > 5 * 60) return false;

  const manifest = `id:${paymentId.toLowerCase()};request-id:${requestId};ts:${timestamp};`;
  const expectedSignature = createHmac('sha256', secret).update(manifest).digest('hex');
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const receivedBuffer = Buffer.from(receivedSignature, 'hex');
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  if (!process.env.MERCADOPAGO_ACCESS_TOKEN) return NextResponse.json({error: 'Mercado Pago não configurado.'}, {status: 503});
  const url = new URL(request.url);
  const body = await request.json().catch(() => ({})) as {data?: {id?: string}; type?: string; action?: string};
  const paymentId = body.data?.id || url.searchParams.get('data.id');
  const type = body.type || url.searchParams.get('type');
  if (type !== 'payment' || !paymentId) return NextResponse.json({received: true});
  if (!process.env.MERCADOPAGO_WEBHOOK_SECRET) return NextResponse.json({error: 'Webhook do Mercado Pago não configurado.'}, {status: 503});
  if (!hasValidSignature(request, paymentId)) return NextResponse.json({error: 'Assinatura inválida.'}, {status: 401});

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