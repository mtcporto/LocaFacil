import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SmartSuggestionsClient from "@/components/notifications/SmartSuggestionsClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Send, Sparkles } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Gerenciar Notificações</h1>
        <p className="text-muted-foreground">Comunique-se com seus inquilinos de forma eficaz. Use IA para criar notificações inteligentes.</p>
      </section>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="compose"><Send className="mr-2 h-4 w-4" />Escrever Manualmente</TabsTrigger>
          <TabsTrigger value="ai-suggest"><Sparkles className="mr-2 h-4 w-4" />Sugestões da IA</TabsTrigger>
        </TabsList>
        <TabsContent value="compose">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Escrever Nova Notificação</CardTitle>
              <CardDescription>Escreva uma mensagem para enviar aos seus inquilinos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notification-title">Título</Label>
                <Textarea id="notification-title" placeholder="Ex: Atualização Importante de Manutenção" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="notification-message">Mensagem</Label>
                <Textarea id="notification-message" placeholder="Digite o conteúdo da sua notificação aqui..." rows={5} className="mt-1" />
              </div>
              {/* Adicionar seleção de público (todos, imóvel específico, inquilino específico) aqui */}
              <Button className="w-full md:w-auto">
                <Send className="mr-2 h-4 w-4" /> Enviar Notificação
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-suggest">
            <SmartSuggestionsClient />
        </TabsContent>
      </Tabs>
      
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Notificações Enviadas</CardTitle>
            <CardDescription>Histórico de notificações enviadas.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Placeholder for list of sent notifications */}
            <p className="text-muted-foreground">Nenhuma notificação enviada ainda.</p>
        </CardContent>
      </Card>
    </div>
  );
}
