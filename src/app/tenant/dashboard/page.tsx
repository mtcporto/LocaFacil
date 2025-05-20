import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, CreditCard, Bell, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TenantDashboardPage() {
  const rentStatus = { status: "Pago", dueDate: "5 de Julho, 2024", amount: 1200 }; // Mock data
  const leaseEndDate = "14 de Janeiro, 2025"; // Mock data

  const recentNotifications = [
    { id: 1, title: "Manutenção Agendada do Elevador", date: "28 de Junho, 2024", read: false, type: "Manutenção" },
    { id: 2, title: "Área da Piscina Reaberta", date: "25 de Junho, 2024", read: true, type: "Atualização de Comodidade" },
    { id: 3, title: "Atualização de Entrega de Pacotes", date: "20 de Junho, 2024", read: true, type: "Geral" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Painel do Inquilino</h1>
        <p className="text-muted-foreground">Bem-vindo! Gerencie sua locação e mantenha-se atualizado.</p>
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
            {rentStatus.status === "Pago" ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-6 w-6" />
                <span className="text-xl font-semibold">Aluguel Pago</span>
              </div>
            ) : rentStatus.status === "Pendente" ? ( // Assuming "Due" is "Pendente"
              <div className="flex items-center text-orange-600">
                <AlertTriangle className="mr-2 h-6 w-6" />
                <span className="text-xl font-semibold">Aluguel Pendente</span>
              </div>
            ) : ( // Assuming any other status like "Overdue"
               <div className="flex items-center text-red-600">
                <AlertTriangle className="mr-2 h-6 w-6" />
                <span className="text-xl font-semibold">Aluguel Atrasado</span>
              </div>
            )}
            <p className="text-muted-foreground">Próximo pagamento: R$ {rentStatus.amount.toFixed(2)}</p>
            <p className="text-muted-foreground">Vencimento: {rentStatus.dueDate}</p>
            <Button className="w-full md:w-auto mt-2">
              <CreditCard className="mr-2 h-4 w-4" /> Fazer Pagamento
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
