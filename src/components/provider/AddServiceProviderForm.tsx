
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";

const addServiceProviderFormSchema = z.object({
  companyName: z.string().min(2, { message: "Nome da empresa é obrigatório." }),
  serviceType: z.string().min(3, { message: "Tipo de serviço é obrigatório." }),
  contactName: z.string().optional(),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos." }),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal('')),
  notes: z.string().optional(),
  lastServiceDate: z.date().optional(),
});

export default function AddServiceProviderForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof addServiceProviderFormSchema>>({
    resolver: zodResolver(addServiceProviderFormSchema),
    defaultValues: {
      companyName: "",
      serviceType: "",
      contactName: "",
      phone: "",
      email: "",
      notes: "",
      lastServiceDate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof addServiceProviderFormSchema>) {
    setIsLoading(true);
    
    const formattedValues = {
        ...values,
        lastServiceDate: values.lastServiceDate ? format(values.lastServiceDate, "yyyy-MM-dd") : undefined,
    };

    console.log("Dados do novo fornecedor (simulado):", formattedValues);
    // Em uma app real: mockServiceProviders.push({ id: `sp${mockServiceProviders.length + 1}`, ...formattedValues });

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    toast({
      title: "Fornecedor Adicionado!",
      description: `O fornecedor "${values.companyName}" foi registrado com sucesso (simulação).`,
    });
    router.push("/landlord/providers");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nome da Empresa</FormLabel>
                <FormControl><Input placeholder="Nome da empresa prestadora" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tipo de Serviço</FormLabel>
                <FormControl><Input placeholder="Ex: Dedetização, Elétrica, Hidráulica" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nome do Contato (Opcional)</FormLabel>
                <FormControl><Input placeholder="Nome da pessoa de contato" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Telefone Principal</FormLabel>
                <FormControl><Input placeholder="(XX) XXXXX-XXXX" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email de Contato (Opcional)</FormLabel>
                <FormControl><Input type="email" placeholder="contato@empresa.com" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="lastServiceDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Último Serviço (Opcional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value && isValid(field.value) ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (Opcional)</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Detalhes adicionais, horários de atendimento, etc..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Fornecedor
          </Button>
        </div>
      </form>
    </Form>
  );
}
