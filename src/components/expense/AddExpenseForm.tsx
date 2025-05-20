
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { mockProperties, type ExpenseCategory } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";

const expenseCategories: ExpenseCategory[] = ['Manutenção', 'Pessoal', 'Administrativo', 'Marketing', 'Impostos', 'Outros'];

const addExpenseFormSchema = z.object({
  description: z.string().min(3, { message: "Descrição deve ter pelo menos 3 caracteres." }),
  amount: z.coerce.number({ invalid_type_error: "Valor deve ser um número." }).positive({ message: "Valor deve ser positivo." }),
  date: z.date({ required_error: "Data da despesa é obrigatória." }),
  category: z.enum(expenseCategories, { required_error: "Selecione a categoria." }),
  propertyId: z.string().optional(),
  notes: z.string().optional(),
});

export default function AddExpenseForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof addExpenseFormSchema>>({
    resolver: zodResolver(addExpenseFormSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: new Date(),
      category: undefined,
      propertyId: "none", // Default to "none"
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addExpenseFormSchema>) {
    setIsLoading(true);
    
    const formattedValues = {
        ...values,
        date: format(values.date, "yyyy-MM-dd"),
        propertyId: values.propertyId === "none" ? undefined : values.propertyId,
    };

    console.log("Dados da nova despesa (simulado):", formattedValues);
    // Em uma app real: mockExpenses.push({ id: `ex${mockExpenses.length + 1}`, ...formattedValues });

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    toast({
      title: "Despesa Adicionada!",
      description: `A despesa "${values.description}" foi registrada com sucesso (simulação).`,
    });
    router.push("/landlord/expenses");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da Despesa</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Conserto de vazamento, Compra de material de escritório" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Ex: 150.50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Despesa</FormLabel>
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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {expenseCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Imóvel Associado (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger><SelectValue placeholder="Nenhum imóvel específico" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {mockProperties.map(prop => (
                        <SelectItem key={prop.id} value={prop.id}>{prop.name} - {prop.address}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormDescription>Selecione se esta despesa é de um imóvel específico.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações (Opcional)</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Detalhes adicionais sobre a despesa..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Despesa
          </Button>
        </div>
      </form>
    </Form>
  );
}
