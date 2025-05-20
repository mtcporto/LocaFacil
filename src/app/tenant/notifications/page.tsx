import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function TenantNotificationsPage() {
  // Mock notification data
  const notifications = [
    { id: "n1", title: "Importante: Interrupção no Fornecimento de Água Amanhã de Manhã", date: "2024-07-10", content: "Informamos que haverá uma interrupção temporária no fornecimento de água amanhã, 11 de julho, das 9h às 12h, devido a uma manutenção essencial. Pedimos desculpas por qualquer inconveniente.", read: false, type: "Urgente" },
    { id: "n2", title: "Churrasco Comunitário no Próximo Sábado!", date: "2024-07-08", content: "Junte-se a nós para um churrasco comunitário na área comum no próximo sábado, 20 de julho, às 14h. Comida e bebidas serão fornecidas!", read: false, type: "Evento" },
    { id: "n3", title: "Lembrete: Aluguel Vence em Breve", date: "2024-07-01", content: "Este é um lembrete amigável de que o pagamento do seu aluguel vence no dia 5 de julho. Você pode fazer pagamentos através do portal do inquilino.", read: true, type: "Lembrete" },
    { id: "n4", title: "Reforma da Academia Concluída", date: "2024-06-25", content: "Temos o prazer de anunciar que a reforma da academia foi concluída e ela já está aberta para uso. Aproveite os novos equipamentos!", read: true, type: "Comodidade" },
  ];

  const getBadgeVariant = (type: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (type) {
      case "Urgente": return "destructive";
      case "Evento": return "default";
      case "Lembrete": return "outline";
      default: return "secondary";
    }
  }
  
  const getBadgeClass = (type: string): string => {
    switch (type) {
      case "Urgente": return "bg-red-100 text-red-700 border-red-300";
      case "Evento": return "bg-blue-100 text-blue-700 border-blue-300"; // Primary based
      case "Lembrete": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Comodidade": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300"; // Muted/Secondary based
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Minhas Notificações</h1>
        <p className="text-muted-foreground">Mantenha-se atualizado com anúncios e atualizações importantes da administração.</p>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-6 w-6 text-primary" />
            Feed de Notificações
          </CardTitle>
          <CardDescription>
            Todas as mensagens e alertas relacionados à sua locação e ao condomínio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-6">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className={`p-4 rounded-lg border ${!notification.read ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`text-lg font-semibold ${!notification.read ? 'text-primary' : 'text-foreground'}`}>{notification.title}</h3>
                        <p className="text-xs text-muted-foreground">{formatDate(notification.date)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getBadgeVariant(notification.type)} className={getBadgeClass(notification.type)}>{notification.type}</Badge>
                        {!notification.read && (
                          <span title="Não lida" className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{notification.content}</p>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhuma notificação no momento.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
