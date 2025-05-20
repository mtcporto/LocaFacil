
// src/ai/flows/smart-notification-suggestions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting smart notifications
 * to landlords based on real-time data such as weather, city events, and maintenance schedules.
 *
 * - suggestNotification - A function that takes input data and returns a suggested notification message.
 * - SuggestNotificationInput - The input type for the suggestNotification function.
 * - SuggestNotificationOutput - The output type for the suggestNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNotificationInputSchema = z.object({
  weatherForecast: z.string().optional().describe('A previsão do tempo para os próximos dias. Opcional.'),
  cityEvents: z.string().optional().describe('Eventos futuros na cidade que podem afetar os inquilinos. Opcional.'),
  maintenanceSchedule: z
    .string()
    .optional()
    .describe('O cronograma de manutenção planejado para o edifício. Opcional.'),
  pastNotifications: z
    .string()
    .describe('Uma lista de notificações passadas que foram enviadas aos inquilinos.')
    .optional(),
});
export type SuggestNotificationInput = z.infer<typeof SuggestNotificationInputSchema>;

const SuggestNotificationOutputSchema = z.object({
  notificationMessage: z.string().describe('A mensagem de notificação sugerida para enviar aos inquilinos.'),
});
export type SuggestNotificationOutput = z.infer<typeof SuggestNotificationOutputSchema>;

export async function suggestNotification(input: SuggestNotificationInput): Promise<SuggestNotificationOutput> {
  return suggestNotificationFlow(input);
}

const suggestNotificationPrompt = ai.definePrompt({
  name: 'suggestNotificationPrompt',
  input: {schema: SuggestNotificationInputSchema},
  output: {schema: SuggestNotificationOutputSchema},
  prompt: `Você é um assistente de IA que ajuda proprietários a criar notificações relevantes e oportunas para seus inquilinos.

  Baseado em qualquer um dos seguintes dados em tempo real fornecidos, sugira uma mensagem de notificação para enviar aos inquilinos:

  Previsão do Tempo: {{{weatherForecast}}}
  Eventos da Cidade: {{{cityEvents}}}
  Cronograma de Manutenção: {{{maintenanceSchedule}}}
  Notificações Anteriores: {{{pastNotifications}}}

  Considere estes fatores ao redigir a notificação: urgência, relevância para os inquilinos,
  e potencial impacto em suas vidas diárias. Use a informação que está disponível e é mais relevante.
  Evite enviar notificações duplicadas ou desnecessárias se notificações anteriores forem fornecidas.

  Sua resposta final deve ser APENAS a mensagem de notificação concisa que pode ser diretamente enviada aos inquilinos.

  Responda sempre em português brasileiro.

  Formate sua resposta como um objeto JSON com a seguinte chave:
  - notificationMessage: A mensagem de notificação sugerida.
  `,
});

const suggestNotificationFlow = ai.defineFlow(
  {
    name: 'suggestNotificationFlow',
    inputSchema: SuggestNotificationInputSchema,
    outputSchema: SuggestNotificationOutputSchema,
  },
  async input => {
    const {output} = await suggestNotificationPrompt(input);
    return output!;
  }
);
