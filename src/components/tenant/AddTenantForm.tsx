
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { mockProperties, type TaxStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";

const addTenantFormSchema = z.object({
  name: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Endereço de email inválido." }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos." }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido. Formato: XXX.XXX.XXX-XX." }),
  propertyId: z.string({ required_error: "Selecione o imóvel." }),
  apartmentUnit: z.string().min(1, { message: "Unidade do apartamento é obrigatória." }),
  leaseStartDate: z.date({ required_error: "Data de início do contrato é obrigatória." }),
  leaseEndDate: z.date({ required_error: "Data de fim do contrato é obrigatória." }),
  rent_paid_status: z.enum(['Pago', 'Pendente', 'Vencido'], { required_error: "Selecione o status do aluguel." }),
  iptuAmount: z.coerce.number().positive({ message: "Valor do IPTU deve ser positivo." }).optional().or(z.literal(0)),
  iptuDueDate: z.date().optional(),
  iptuStatus: z.enum(['Pago', 'Pendente', 'Vencido']).optional(),
  tcrAmount: z.coerce.number().positive({ message: "Valor da TCR deve ser positivo." }).optional().or(z.literal(0)),
  tcrDueDate: z.date().optional(),
  tcrStatus: z.enum(['Pago', 'Pendente', 'Vencido']).optional(),
}).refine(data => {
    if (data.leaseEndDate && data.leaseStartDate) {
        return data.leaseEndDate > data.leaseStartDate;
    }
    return true;
}, {
    message: "Data de fim do contrato deve ser posterior à data de início.",
    path: ["leaseEndDate"],
});

export default function AddTenantForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof addTenantFormSchema>>({
    resolver: zodResolver(addTenantFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      propertyId: undefined,
      apartmentUnit: "",
      leaseStartDate: undefined,
      leaseEndDate: undefined,
      rent_paid_status: "Pendente" as TaxStatus,
      iptuAmount: 0,
      iptuDueDate: undefined,
      iptuStatus: "Pendente" as TaxStatus,
      tcrAmount: 0,
      tcrDueDate: undefined,
      tcrStatus: "Pendente" as TaxStatus,
    },
  });

  async function onSubmit(values: z.infer<typeof addTenantFormSchema>) {
    setIsLoading(true);
    
    const formattedValues = {
        ...values,
        leaseStartDate: format(values.leaseStartDate, "yyyy-MM-dd"),
        leaseEndDate: format(values.leaseEndDate, "yyyy-MM-dd"),
        iptuDueDate: values.iptuDueDate ? format(values.iptuDueDate, "yyyy-MM-dd") : undefined,
        tcrDueDate: values.tcrDueDate ? format(values.tcrDueDate, "yyyy-MM-dd") : undefined,
    };

    console.log("Dados do novo inquilino (simulado):", formattedValues);
    // Aqui você adicionaria o novo inquilino ao mockData ou enviaria para uma API
    // Por exemplo: mockTenants.push({ id: `t${mockTenants.length + 1}`, ...formattedValues });

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    toast({
      title: "Inquilino Adicionado!",
      description: `O inquilino "${values.name}" foi cadastrado com sucesso (simulação).`,
    });
    router.push("/landlord/tenants");
  }

  const taxStatusOptions: TaxStatus[] = ['Pago', 'Pendente', 'Vencido'];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className="text-lg font-medium text-primary border-b pb-2">Informações Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl><Input placeholder="Nome do inquilino" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl><Input placeholder="(XX) XXXXX-XXXX" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl><Input placeholder="000.000.000-00" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Detalhes da Locação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="propertyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imóvel Alugado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione o imóvel" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {mockProperties.map(prop => (
                      <SelectItem key={prop.id} value={prop.id}>{prop.name} - {prop.address}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apartmentUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade / Apartamento</FormLabel>
                <FormControl><Input placeholder="Ex: 101, Casa A" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="leaseStartDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início do Contrato</FormLabel>
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
                      disabled={(date) => date < new Date("1900-01-01") }
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
            name="leaseEndDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Fim do Contrato</FormLabel>
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
                      disabled={(date) => date < new Date("1900-01-01") || (form.getValues("leaseStartDate") && date <= form.getValues("leaseStartDate"))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Status Financeiro Inicial</h3>
        <FormField
            control={form.control}
            name="rent_paid_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status do Aluguel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione o status do aluguel" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {taxStatusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
           <FormField
            control={form.control}
            name="iptuAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do IPTU (Anual)</FormLabel>
                <FormControl><Input type="number" step="0.01" placeholder="Ex: 550.00" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="iptuDueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Vencimento IPTU</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal",!field.value && "text-muted-foreground")}>
                        {field.value && isValid(field.value) ? format(field.value, "dd/MM/yyyy") : <span>Escolha uma data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="iptuStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status IPTU</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Status do IPTU" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {taxStatusOptions.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <FormField
            control={form.control}
            name="tcrAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor da TCR (Anual)</FormLabel>
                <FormControl><Input type="number" step="0.01" placeholder="Ex: 120.50" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tcrDueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Vencimento TCR</FormLabel>
                 <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value && isValid(field.value) ? format(field.value, "dd/MM/yyyy") : <span>Escolha uma data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tcrStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status TCR</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Status da TCR" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {taxStatusOptions.map(status => (<SelectItem key={status} value={status}>{status}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Inquilino
          </Button>
        </div>
      </form>
    </Form>
  );
}

