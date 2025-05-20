
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
  weatherForecast: z.string().optional(),
  cityEvents: z.string().optional(),
  maintenanceSchedule: z.string().optional(),
  pastNotifications: z.string().optional(),
}).refine(data => {
  return !!data.weatherForecast || !!data.cityEvents || !!data.maintenanceSchedule;
}, {
  message: "Forneça informações para pelo menos um dos seguintes: Previsão do Tempo, Eventos da Cidade ou Cronograma de Manutenção.",
  // Você pode direcionar a mensagem de erro para um campo específico se desejar,
  // mas como é uma validação de nível de objeto, pode ser melhor exibi-la de forma geral
  // ou associar a um dos campos (ex: path: ["weatherForecast"]) e ajustar a UI para mostrar erros globais.
  // Por simplicidade, a mensagem de erro aparecerá abaixo do último campo se não houver path.
  // Vamos exibir manualmente um erro geral no formulário.
});

export default function SmartSuggestionsClient() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestNotificationOutput | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedReasoning, setCopiedReasoning] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
    setFormError(null); // Limpa erros anteriores
    if (!values.weatherForecast && !values.cityEvents && !values.maintenanceSchedule) {
        setFormError("Forneça informações para pelo menos um dos seguintes: Previsão do Tempo, Eventos da Cidade ou Cronograma de Manutenção.");
        // A validação refine do Zod já deve pegar isso, mas uma verificação explícita pode ser útil.
        // O resolver do Zod deve colocar a mensagem do refine no formState.errors,
        // mas pode ser que precise ser manualmente extraída e exibida.
        // Se a mensagem do refine não aparecer automaticamente, esta lógica de setFormError garante feedback.
        if (form.formState.errors.root) {
             setFormError(form.formState.errors.root.message || "Erro de validação.");
        }
        return;
    }

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
            Forneça algum contexto (pelo menos um dos três primeiros campos) e nossa IA ajudará a redigir notificações relevantes e oportunas para seus inquilinos.
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
                    <FormLabel>Previsão do Tempo (Opcional)</FormLabel>
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
                    <FormLabel>Eventos da Cidade (Opcional)</FormLabel>
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
                    <FormLabel>Cronograma de Manutenção (Opcional)</FormLabel>
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
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
               {formError && !form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {formError}
                </p>
              )}
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

    