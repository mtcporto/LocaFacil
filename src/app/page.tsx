import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Search, UserCog, Users, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import {mockProperties} from '@/lib/mockData';

export default function HomePage() {
  return (
    <div className="space-y-20 pb-10">
      <section className="relative isolate min-h-[560px] overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
        <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=88" alt="Sala iluminada de um imóvel moderno" fill priority className="object-cover object-center opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/65 to-slate-950/10" />
        <div className="relative flex min-h-[560px] max-w-3xl flex-col justify-end px-6 py-10 sm:px-12 sm:py-14">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300"><Sparkles className="h-4 w-4" /> Morar bem começa aqui</p>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">Seu próximo endereço merece uma boa história.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">Imóveis selecionados, detalhes transparentes e uma experiência de locação mais simples em João Pessoa e região.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="bg-amber-400 text-slate-950 hover:bg-amber-300"><Link href="/properties">Explorar imóveis <ArrowRight className="ml-2 h-5 w-5" /></Link></Button>
            <Button size="lg" variant="outline" asChild className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"><Link href="/auth/login">Entrar no portal</Link></Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
          <Card className="border-0 bg-amber-50 shadow-none">
            <CardHeader className="items-center">
              <div className="p-3 bg-accent/20 rounded-full mb-3">
                <Search className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-xl text-center">Para Futuros Inquilinos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Encontre seu próximo lar facilmente. Navegue por anúncios detalhados, veja fotos e envie sua proposta digitalmente.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="border-0 bg-sky-50 shadow-none">
            <CardHeader className="items-center">
              <div className="p-3 bg-primary/20 rounded-full mb-3">
                 <UserCog className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl text-center">Para Proprietários</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Gerencie imóveis, inquilinos e comunicações de forma eficiente. Use IA para sugestões de notificações inteligentes.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="border-0 bg-emerald-50 shadow-none">
            <CardHeader className="items-center">
              <div className="p-3 bg-secondary rounded-full mb-3">
                <Users className="h-8 w-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl text-center">Para Inquilinos Atuais</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Acesse informações do seu contrato, receba atualizações importantes e gerencie sua locação através de um portal dedicado.
              </CardDescription>
            </CardContent>
          </Card>
      </section>

      <section>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Seleção da semana</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Espaços para chamar de seu</h2></div>
          <Button variant="link" asChild className="hidden sm:flex"><Link href="/properties">Ver todos <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {mockProperties.slice(0, 3).map(property => (
            <Link href={`/properties/${property.id}`} key={property.id} className="group relative min-h-[340px] overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg">
              <Image src={property.images[0]} alt={property.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5"><p className="text-sm text-white/70">{property.type} · {property.city}</p><h3 className="mt-1 text-xl font-semibold">{property.name}</h3><p className="mt-3 font-medium text-amber-300">R$ {property.rent_amount.toFixed(2)} <span className="text-sm font-normal text-white/70">/mês</span></p></div>
            </Link>
          ))}
        </div>
        <Button variant="outline" asChild className="mt-5 w-full sm:hidden"><Link href="/properties">Ver todos os imóveis <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
      </section>
    </div>
  );
}
