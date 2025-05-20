
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
  weatherForecast: z.string().optional().describe('The weather forecast for the next few days. Optional.'),
  cityEvents: z.string().optional().describe('Upcoming city events that may affect tenants. Optional.'),
  maintenanceSchedule: z
    .string()
    .optional()
    .describe('The planned maintenance schedule for the building. Optional.'),
  pastNotifications: z
    .string()
    .describe('A list of past notifications that were sent to tenants.')
    .optional(),
});
export type SuggestNotificationInput = z.infer<typeof SuggestNotificationInputSchema>;

const SuggestNotificationOutputSchema = z.object({
  notificationMessage: z.string().describe('The suggested notification message to send to tenants.'),
  reasoning: z
    .string()
    .describe('Reasoning for the suggested notification, including which factors were considered.'),
});
export type SuggestNotificationOutput = z.infer<typeof SuggestNotificationOutputSchema>;

export async function suggestNotification(input: SuggestNotificationInput): Promise<SuggestNotificationOutput> {
  return suggestNotificationFlow(input);
}

const suggestNotificationPrompt = ai.definePrompt({
  name: 'suggestNotificationPrompt',
  input: {schema: SuggestNotificationInputSchema},
  output: {schema: SuggestNotificationOutputSchema},
  prompt: `You are an AI assistant that helps landlords create relevant and timely notifications for their tenants.

  Based on any of the following real-time data provided, suggest a notification message to send to tenants:

  Weather Forecast: {{{weatherForecast}}}
  City Events: {{{cityEvents}}}
  Maintenance Schedule: {{{maintenanceSchedule}}}
  Past Notifications: {{{pastNotifications}}}

  Consider these factors when drafting the notification: urgency, relevance to tenants,
  and potential impact on their daily lives. Use the information that is available and most relevant.
  Avoid sending duplicate or unnecessary notifications if past notifications are provided.

  Reason your notification suggestion step by step. Your final answer should include:
  * A concise notification message that can be directly sent to tenants.
  * A brief explanation of why this notification is important and which data points you considered.

  Format your answer as a JSON object with the following keys:
  - notificationMessage: The suggested notification message.
  - reasoning: Explanation for the notification.
  `,
});

const suggestNotificationFlow = ai.defineFlow(
  {
    name: 'suggestNotificationFlow',
    inputSchema: SuggestNotificationInputSchema,
    outputSchema: SuggestNotificationOutputSchema,
  },
  async input => {
    // Adicionar uma verificação para garantir que pelo menos um dos campos de contexto principais está presente
    if (!input.weatherForecast && !input.cityEvents && !input.maintenanceSchedule) {
      // Poderia retornar um erro ou uma resposta padrão indicando que mais informações são necessárias.
      // Por enquanto, vamos deixar o prompt tentar lidar com isso, mas em um cenário real,
      // uma validação mais robusta aqui ou no frontend é ideal.
      // O Zod refine no frontend já deve prevenir isso.
    }
    const {output} = await suggestNotificationPrompt(input);
    return output!;
  }
);

    