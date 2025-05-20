
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, CreditCard, Bell, AlertTriangle, CheckCircle, DollarSign, Circle, Clock, Coins, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { mockTenants, type TaxStatus } from "@/lib/mockData"; // Importar mockTenants e TaxStatus
import type React from "react";

// Helper function to format date string (YYYY-MM-DD) to DD/MM/YYYY
const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString; 
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

// Helper function to get display info for tax status
const getTaxStatusDisplayInfo = (status: TaxStatus | undefined): { text: string; Icon: React.ElementType; colorClass: string; badgeVariant: "default" | "outline" | "destructive" | "secondary"; badgeClassName: string } => {
  switch (status) {
    case 'Pago':
      return { text: 'Pago', Icon: CheckCircle, colorClass: 'text-green-600', badgeVariant: 'default', badgeClassName: 'bg-green-100 text-green-700 border-green-300' };
    case 'Pendente':
      return { text: 'Pendente', Icon: Clock, colorClass: 'text-yellow-600', badgeVariant: 'outline', badgeClassName: 'bg-yellow-100 text-yellow-700 border-yellow-300' };
    case 'Vencido':
      return { text: 'Vencido', Icon: AlertTriangle, colorClass: 'text-red-600', badgeVariant: 'destructive', badgeClassName: 'bg-red-100 text-red-700 border-red-300' };
    default:
      return { text: 'N/A', Icon: Circle, colorClass: 'text-muted-foreground', badgeVariant: 'secondary', badgeClassName: 'bg-gray-100 text-gray-700 border-gray-300' };
  }
};


export default function TenantDashboardPage() {
  const router = useRouter(); 
  
  // Simulação de inquilino logado - Em um app real, isso viria do contexto de autenticação
  const MOCK_LOGGED_IN_TENANT_ID = 't2'; // João Santos, que tem status variados
  const tenantData = mockTenants.find(t => t.id === MOCK_LOGGED_IN_TENANT_ID);

  const rentStatus = tenantData ? { status: tenantData.rent_paid_status, dueDate: "5 de Julho, 2024", amount: 950 } : { status: "Pendente" as TaxStatus, dueDate: "N/A", amount: 0}; // Mock dueDate and amount for rent
  const leaseEndDate = tenantData ? new Date(tenantData.leaseEndDate).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A";

  const recentNotifications = [
    { id: 1, title: "Manutenção Agendada do Elevador", date: "28 de Junho, 2024", read: false, type: "Manutenção" },
    { id: 2, title: "Área da Piscina Reaberta", date: "25 de Junho, 2024", read: true, type: "Atualização de Comodidade" },
    { id: 3, title: "Atualização de Entrega de Pacotes", date: "20 de Junho, 2024", read: true, type: "Geral" },
  ];

  if (!tenantData) {
    return (
      <div className="space-y-8 text-center">
         <h1 className="text-3xl font-bold text-primary mb-2">Painel do Inquilino</h1>
         <p className="text-muted-foreground">Dados do inquilino não encontrados. Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }
  
  const rentStatusInfo = getTaxStatusDisplayInfo(tenantData.rent_paid_status);
  const iptuStatusInfo = getTaxStatusDisplayInfo(tenantData.iptuStatus);
  const tcrStatusInfo = getTaxStatusDisplayInfo(tenantData.tcrStatus);


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Painel do Inquilino</h1>
        <p className="text-muted-foreground">Bem-vindo(a), {tenantData.name}! Gerencie sua locação e mantenha-se atualizado.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              Status do Aluguel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`flex items-center ${rentStatusInfo.colorClass}`}>
              <rentStatusInfo.Icon className="mr-2 h-6 w-6" />
              <span className="text-xl font-semibold">Aluguel {rentStatusInfo.text}</span>
            </div>
            <p className="text-muted-foreground">Próximo pagamento: R$ {rentStatus.amount.toFixed(2)}</p>
            <p className="text-muted-foreground">Vencimento (referência): {rentStatus.dueDate}</p>
            <Button className="w-full md:w-auto mt-2" onClick={() => router.push('/tenant/payments')}>
              <CreditCard className="mr-2 h-4 w-4" /> Ver Histórico/Pagar Aluguel
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Informações do Contrato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-foreground">Seu contrato atual está ativo.</p>
            <p className="text-muted-foreground">Data de término do contrato: {leaseEndDate}</p>
            <Button variant="outline" className="w-full md:w-auto mt-2" asChild>
              <Link href="/tenant/lease">
                Ver Detalhes do Contrato
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Card de Taxas Anuais */}
      <Card className="shadow-md md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Coins className="mr-2 h-5 w-5 text-primary" />
            Taxas Anuais (IPTU/TCR)
          </CardTitle>
          <CardDescription>Verifique o status e datas de vencimento do seu IPTU e TCR.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seção IPTU */}
          <div className="p-4 border rounded-lg bg-secondary/50">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-foreground">IPTU</h4>
              <Badge variant={iptuStatusInfo.badgeVariant} className={iptuStatusInfo.badgeClassName}>
                <iptuStatusInfo.Icon className="mr-1 h-4 w-4" /> {iptuStatusInfo.text}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center"><DollarSign className="mr-1.5 h-4 w-4"/> Valor: R$ {tenantData.iptuAmount.toFixed(2)}</p>
            <p className="text-muted-foreground flex items-center"><CalendarDays className="mr-1.5 h-4 w-4"/> Vencimento: {formatDateForDisplay(tenantData.iptuDueDate)}</p>
          </div>

          {/* Seção TCR */}
          <div className="p-4 border rounded-lg bg-secondary/50">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-semibold text-foreground">TCR</h4>
              <Badge variant={tcrStatusInfo.badgeVariant} className={tcrStatusInfo.badgeClassName}>
                <tcrStatusInfo.Icon className="mr-1 h-4 w-4" /> {tcrStatusInfo.text}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center"><DollarSign className="mr-1.5 h-4 w-4"/> Valor: R$ {tenantData.tcrAmount.toFixed(2)}</p>
            <p className="text-muted-foreground flex items-center"><CalendarDays className="mr-1.5 h-4 w-4"/> Vencimento: {formatDateForDisplay(tenantData.tcrDueDate)}</p>
          </div>
          
          <Button className="w-full mt-4" onClick={() => router.push('/tenant/payments')}>
            <CreditCard className="mr-2 h-4 w-4" /> Ir para Pagamentos de Taxas
          </Button>
        </CardContent>
      </Card>


      <section>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Notificações Recentes
            </CardTitle>
            <CardDescription>Mantenha-se informado sobre atualizações e comunicados do condomínio.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentNotifications.length > 0 ? (
              <ul className="space-y-3">
                {recentNotifications.map(notif => (
                  <li key={notif.id} className={`p-3 rounded-md border flex justify-between items-center ${!notif.read ? 'bg-primary/10 border-primary/30' : 'bg-secondary/50'}`}>
                    <div>
                      <h4 className={`font-medium ${!notif.read ? 'text-primary' : 'text-foreground'}`}>{notif.title}</h4>
                      <p className="text-xs text-muted-foreground">{notif.date} - {notif.type}</p>
                    </div>
                    {!notif.read && <Badge variant="default" className="bg-primary">Nova</Badge>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Nenhuma nova notificação.</p>
            )}
            <Button variant="link" className="mt-4 px-0 text-primary" asChild>
              <Link href="/tenant/notifications">Ver Todas as Notificações</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
