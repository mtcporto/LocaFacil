
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
    { title: "Total de Imóveis", value: totalProperties.toString(), icon: Building, color: "text-primary" },
    { title: "Unidades Ocupadas", value: occupiedUnits.toString(), icon: Users, color: "text-purple-500" }, // Cor alterada para diferenciar
    { title: "Aluguéis a Receber (Mês)", value: `R$ ${totalToReceiveRent.toFixed(2)}`, icon: DollarSign, color: "text-blue-500" },
    { title: "Aluguéis Recebidos (Mês)", value: `R$ ${totalReceivedRent.toFixed(2)}`, icon: CheckCircle, color: "text-green-500" },
    { title: "Aluguéis Pendentes/Vencidos", value: `R$ ${totalPendingOrOverdueRent.toFixed(2)}`, icon: AlertTriangle, color: "text-red-500" },
    { title: "Notificações Pendentes", value: "3", icon: Bell, color: "text-yellow-500" }, // Placeholder value
  ];

  const quickLinks = [
    { href: "/landlord/properties/add", label: "Adicionar Novo Imóvel", icon: PlusCircle },
    { href: "/landlord/notifications", label: "Enviar Notificação", icon: Bell },
    { href: "/landlord/tenants", label: "Ver Todos Inquilinos", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Painel do Proprietário</h1>
        <p className="text-muted-foreground">Bem-vindo de volta! Aqui está um resumo de seus imóveis e atividades.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> 
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* <p className="text-xs text-muted-foreground">Status atual</p> */}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
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

        <Card className="shadow-md">
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
