import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Search, UserCog, Users } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-xl shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            LocaFácil: Gestão de Imóveis Descomplicada
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-3xl mx-auto">
            Capacitando proprietários com ferramentas inteligentes e oferecendo aos inquilinos uma experiência de aluguel transparente e moderna.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/properties">
                Ver Imóveis Disponíveis <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/auth/login">
                Acessar seu Portal
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-10 text-primary">Por que escolher o LocaFácil?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
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
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
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
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
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
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
         <Card className="overflow-hidden shadow-xl">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image
                src="https://placehold.co/800x600.png"
                alt="Edifício de apartamentos moderno"
                data-ai-hint="prédio moderno"
                width={800}
                height={600}
                className="object-cover w-full h-64 md:h-full"
              />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-card">
              <h3 className="text-3xl font-semibold text-primary mb-4">Descubra Seu Espaço Perfeito</h3>
              <p className="text-foreground/80 mb-6">
                Nossa plataforma apresenta uma gama diversificada de imóveis para se adequar ao seu estilo de vida. De apartamentos aconchegantes a casas espaçosas, comece sua busca com LocaFácil hoje.
              </p>
              <Button size="lg" asChild className="self-start shadow-md hover:shadow-lg transition-shadow">
                <Link href="/properties">
                  Explorar Anúncios <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
