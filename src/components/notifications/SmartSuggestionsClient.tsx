"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestNotification, type SuggestNotificationInput, type SuggestNotificationOutput } from '@/ai/flows/smart-notification-suggestions';
import { Loader2, Sparkles, ClipboardCopy, ClipboardCheck } from 'lucide-react';

const SuggestionSchema = z.object({
  weatherForecast: z.string().min(10, "Forneça alguns detalhes sobre o clima."),
  cityEvents: z.string().min(5, "Forneça alguns detalhes sobre eventos na cidade."),
  maintenanceSchedule: z.string().min(5, "Forneça detalhes do cronograma de manutenção."),
  pastNotifications: z.string().optional(),
});

export default function SmartSuggestionsClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestNotificationOutput | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedReasoning, setCopiedReasoning] = useState(false);

  const form = useForm<z.infer<typeof SuggestionSchema>>({
    resolver: zodResolver(SuggestionSchema),
    defaultValues: {
      weatherForecast: "",
      cityEvents: "",
      maintenanceSchedule: "",
      pastNotifications: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SuggestionSchema>) {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestNotification(values as SuggestNotificationInput);
      setSuggestion(result);
      toast({
        title: "Sugestão Gerada!",
        description: "A IA elaborou uma notificação para você.",
      });
    } catch (error) {
      console.error("Erro ao gerar sugestão:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao gerar sugestão. Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = async (text: string, type: 'message' | 'reasoning') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'message') setCopiedMessage(true);
      if (type === 'reasoning') setCopiedReasoning(true);
      toast({ title: 'Copiado para a área de transferência!' });
      setTimeout(() => {
        if (type === 'message') setCopiedMessage(false);
        if (type === 'reasoning') setCopiedReasoning(false);
      }, 2000);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Falha ao copiar' });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            Sugestões de Notificação com IA
          </CardTitle>
          <CardDescription>
            Forneça algum contexto e nossa IA ajudará a redigir notificações relevantes e oportunas para seus inquilinos.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="weatherForecast"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Previsão do Tempo</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Chuva forte esperada amanhã, possíveis alagamentos..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityEvents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eventos da Cidade</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Maratona no domingo, Rua Principal fechada das 8h às 14h." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maintenanceSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cronograma de Manutenção</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Manutenção do elevador na quarta-feira, 10h - 12h." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pastNotifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notificações Anteriores (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Aviso de falta de água enviado semana passada." {...field} />
                    </FormControl>
                    <FormDescription>Ajuda a evitar mensagens duplicadas ou muito frequentes.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Gerar Sugestão
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {suggestion && (
        <Card className="shadow-lg bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Sugestão Gerada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold">Mensagem da Notificação:</h4>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(suggestion.notificationMessage, 'message')}>
                  {copiedMessage ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
                  <span className="ml-1">{copiedMessage ? 'Copiado!' : 'Copiar'}</span>
                </Button>
              </div>
              <p className="p-3 bg-background rounded-md border whitespace-pre-wrap">{suggestion.notificationMessage}</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold">Justificativa:</h4>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(suggestion.reasoning, 'reasoning')}>
                  {copiedReasoning ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
                  <span className="ml-1">{copiedReasoning ? 'Copiado!' : 'Copiar'}</span>
                </Button>
              </div>
              <p className="p-3 bg-background rounded-md border text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.reasoning}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => {
                // Lógica para usar esta sugestão, ex: preencher o formulário de composição manual
                // Por enquanto, apenas um toast.
                toast({ title: "Sugestão pronta para uso!", description: "Você pode copiar o texto ou implementar outras ações."});
            }}>Usar Esta Sugestão</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
