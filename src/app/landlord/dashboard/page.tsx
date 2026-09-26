
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building, Users, Bell, PlusCircle, ArrowRight, DollarSign, CheckCircle, AlertTriangle } from "lucide-react";
import { mockProperties, mockTenants } from "@/lib/mockData";

export default function LandlordDashboardPage() {
  
  const totalProperties = mockProperties.length;
  const occupiedUnits = mockTenants.length;

  // Calcular totais financeiros de aluguéis
  let totalToReceiveRent = 0;
  let totalReceivedRent = 0;
  let totalPendingOrOverdueRent = 0;

  mockTenants.forEach(tenant => {
    const property = mockProperties.find(p => p.id === tenant.propertyId);
    if (property) {
      totalToReceiveRent += property.rent_amount;
      if (tenant.rent_paid_status === 'Pago') {
        totalReceivedRent += property.rent_amount;
      } else if (tenant.rent_paid_status === 'Pendente' || tenant.rent_paid_status === 'Vencido') {
        totalPendingOrOverdueRent += property.rent_amount;
      }
    }
  });

  const stats = [
    { title: "Imóveis", value: totalProperties.toString(), icon: Building, color: "text-primary", detail: "no portfólio" },
    { title: "Unidades ocupadas", value: occupiedUnits.toString(), icon: Users, color: "text-sky-600", detail: "inquilinos ativos" },
    { title: "A receber este mês", value: `R$ ${totalToReceiveRent.toFixed(2)}`, icon: DollarSign, color: "text-amber-600", detail: "previsão mensal" },
    { title: "Recebido este mês", value: `R$ ${totalReceivedRent.toFixed(2)}`, icon: CheckCircle, color: "text-emerald-600", detail: "pagamentos confirmados" },
    { title: "Pendências", value: `R$ ${totalPendingOrOverdueRent.toFixed(2)}`, icon: AlertTriangle, color: "text-rose-600", detail: "aluguéis para acompanhar" },
    { title: "Notificações", value: "3", icon: Bell, color: "text-violet-600", detail: "aguardando ação" },
  ];

  const quickLinks = [
    { href: "/landlord/properties/add", label: "Adicionar Novo Imóvel", icon: PlusCircle },
    { href: "/landlord/notifications", label: "Enviar Notificação", icon: Bell },
    { href: "/landlord/tenants", label: "Ver Todos Inquilinos", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-primary px-6 py-8 text-primary-foreground shadow-lg sm:px-8">
        <div className="relative z-10 max-w-2xl">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-primary-foreground/70">Visão geral · Setembro 2026</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Painel do proprietário</h1>
          <p className="mt-3 max-w-xl text-primary-foreground/80">Uma leitura rápida dos seus imóveis, recebimentos e próximas ações.</p>
        </div>
        <Building className="absolute -bottom-10 -right-4 h-48 w-48 text-primary-foreground/10" aria-hidden="true" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/70 shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Execute tarefas comuns rapidamente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickLinks.map((link) => (
              <Button key={link.href} variant="outline" className="w-full justify-start" asChild>
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
             <CardDescription>Últimas atualizações e interações com inquilinos.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent activity feed */}
            <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between p-2 bg-secondary/30 rounded-md"><span>Nova proposta para Unidade 201, Lest Ville</span> <span className="text-muted-foreground">Há 2h</span></li>
                <li className="flex items-center justify-between p-2 bg-secondary/30 rounded-md"><span>Solicitação de manutenção para Apto 5B, Manaira Prime</span> <span className="text-muted-foreground">Há 1d</span></li>
                <li className="flex items-center justify-between p-2 bg-secondary/30 rounded-md"><span>Notificação enviada: "Boas Festas"</span> <span className="text-muted-foreground">Há 3d</span></li>
            </ul>
            <Button variant="link" className="mt-4 px-0 text-primary" asChild>
              <Link href="#">Ver toda atividade <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
