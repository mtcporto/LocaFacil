"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestNotification, type SuggestNotificationInput, type SuggestNotificationOutput } from '@/ai/flows/smart-notification-suggestions';
import { Loader2, Sparkles, ClipboardCopy, ClipboardCheck } from 'lucide-react';

const SuggestionSchema = z.object({
  weatherForecast: z.string().min(10, "Please provide some weather details."),
  cityEvents: z.string().min(5, "Please provide some city event details."),
  maintenanceSchedule: z.string().min(5, "Please provide maintenance schedule details."),
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
        title: "Suggestion Generated!",
        description: "AI has crafted a notification for you.",
      });
    } catch (error) {
      console.error("Error generating suggestion:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate suggestion. Please try again.",
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
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => {
        if (type === 'message') setCopiedMessage(false);
        if (type === 'reasoning') setCopiedReasoning(false);
      }, 2000);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Failed to copy' });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary" />
            AI-Powered Notification Suggestions
          </CardTitle>
          <CardDescription>
            Provide some context, and our AI will help you draft relevant and timely notifications for your tenants.
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
                    <FormLabel>Weather Forecast</FormLabel>
                    <FormControl>
                      <Textarea placeholder="E.g., Heavy rain expected tomorrow, possible flooding..." {...field} />
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
                    <FormLabel>City Events</FormLabel>
                    <FormControl>
                      <Textarea placeholder="E.g., Marathon on Sunday, Main Street will be closed from 8 AM to 2 PM." {...field} />
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
                    <FormLabel>Maintenance Schedule</FormLabel>
                    <FormControl>
                      <Textarea placeholder="E.g., Elevator maintenance on Wednesday, 10 AM - 12 PM." {...field} />
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
                    <FormLabel>Past Notifications (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="E.g., Sent water outage notice last week." {...field} />
                    </FormControl>
                    <FormDescription>Helps avoid duplicate or overly frequent messages.</FormDescription>
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
                Generate Suggestion
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {suggestion && (
        <Card className="shadow-lg bg-primary/5">
          <CardHeader>
            <CardTitle className="text-primary">Generated Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold">Notification Message:</h4>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(suggestion.notificationMessage, 'message')}>
                  {copiedMessage ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
                  <span className="ml-1">{copiedMessage ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
              <p className="p-3 bg-background rounded-md border whitespace-pre-wrap">{suggestion.notificationMessage}</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold">Reasoning:</h4>
                <Button variant="ghost" size="sm" onClick={() => handleCopy(suggestion.reasoning, 'reasoning')}>
                  {copiedReasoning ? <ClipboardCheck className="h-4 w-4 text-green-500" /> : <ClipboardCopy className="h-4 w-4" />}
                  <span className="ml-1">{copiedReasoning ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
              <p className="p-3 bg-background rounded-md border text-sm text-muted-foreground whitespace-pre-wrap">{suggestion.reasoning}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => {
                // Logic to use this suggestion, e.g., populate the manual compose form
                // For now, just a toast.
                toast({ title: "Suggestion ready to use!", description: "You can copy the text or implement further actions."});
            }}>Use This Suggestion</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
