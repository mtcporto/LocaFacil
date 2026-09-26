import {NextResponse} from 'next/server';
import {z} from 'zod';
import {getCurrentSession} from '@/lib/auth';
import {getConstructorInfo, saveConstructorInfo} from '@/lib/db';

const constructorSchema = z.object({
  nome: z.string().min(1), logradouro: z.string().min(1), numero: z.string().min(1), complemento: z.string(),
  bairro: z.string().min(1), cidade: z.string().min(1), estado: z.string().length(2), cep: z.string().min(8),
  telefone: z.string().min(10), whatsapp: z.string().min(10), email: z.string(),
});

export async function GET() {
  return NextResponse.json(await getConstructorInfo());
}

export async function PUT(request: Request) {
  const session = await getCurrentSession();
  if (session?.role !== 'landlord') return NextResponse.json({error: 'Não autorizado.'}, {status: 401});
  const parsed = constructorSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({error: 'Revise os dados informados.'}, {status: 400});
  await saveConstructorInfo({...parsed.data, site: 'https://earlen.com.br/'});
  return NextResponse.json(parsed.data);
}