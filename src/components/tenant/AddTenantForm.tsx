
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
import React, { useEffect } from "react";
import { mockProperties, type TaxStatus, type Tenant } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { format, isValid, parseISO } from "date-fns";

const maritalStatusOptions = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável"];
const taxStatusOptions: TaxStatus[] = ['Pago', 'Pendente', 'Vencido'];

const addTenantFormSchema = z.object({
  name: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Endereço de email inválido." }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos." }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido. Formato: XXX.XXX.XXX-XX." }),
  rg: z.string().min(5, { message: "RG deve ter pelo menos 5 caracteres." }),
  maritalStatus: z.string({ required_error: "Selecione o estado civil." }),
  profession: z.string().min(3, { message: "Profissão deve ter pelo menos 3 caracteres." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }).optional().or(z.literal('')),
  confirmPassword: z.string().min(6, { message: "A confirmação de senha deve ter pelo menos 6 caracteres." }).optional().or(z.literal('')),
  propertyId: z.string({ required_error: "Selecione o imóvel." }),
  apartmentUnit: z.string().min(1, { message: "Unidade do apartamento é obrigatória." }),
  leaseStartDate: z.date({ required_error: "Data de início do contrato é obrigatória." }),
  leaseEndDate: z.date({ required_error: "Data de fim do contrato é obrigatória." }),
  rent_paid_status: z.enum(taxStatusOptions, { required_error: "Selecione o status do aluguel." }),
  iptuAmount: z.coerce.number().nonnegative({ message: "Valor do IPTU não pode ser negativo." }).optional().or(z.literal(0)),
  iptuDueDate: z.date().optional(),
  iptuStatus: z.enum(taxStatusOptions).optional(),
  tcrAmount: z.coerce.number().nonnegative({ message: "Valor da TCR não pode ser negativo." }).optional().or(z.literal(0)),
  tcrDueDate: z.date().optional(),
  tcrStatus: z.enum(taxStatusOptions).optional(),
}).refine(data => {
    if (data.leaseEndDate && data.leaseStartDate) {
        return data.leaseEndDate > data.leaseStartDate;
    }
    return true;
}, {
    message: "Data de fim do contrato deve ser posterior à data de início.",
    path: ["leaseEndDate"],
}).refine(data => {
  if (data.password || data.confirmPassword) { // Se uma senha for fornecida (nova ou alteração)
    if (!data.password || data.password.length < 6) {
      // Este erro será pego pela validação individual do campo password
      return true; 
    }
    return data.password === data.confirmPassword;
  }
  return true; // Se nenhuma senha for fornecida (no modo de edição, por exemplo), não há erro de confirmação
}, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});


interface AddTenantFormProps {
  tenantToEdit?: Tenant;
}

export default function AddTenantForm({ tenantToEdit }: AddTenantFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const isEditing = !!tenantToEdit;

  const form = useForm<z.infer<typeof addTenantFormSchema>>({
    resolver: zodResolver(addTenantFormSchema),
    defaultValues: {
      name: tenantToEdit?.name || "",
      email: tenantToEdit?.email || "",
      phone: tenantToEdit?.phone || "",
      cpf: tenantToEdit?.cpf || "",
      rg: tenantToEdit?.rg || "",
      maritalStatus: tenantToEdit?.maritalStatus || undefined,
      profession: tenantToEdit?.profession || "",
      password: "", // Senha sempre vazia no início (edição ou adição)
      confirmPassword: "",
      propertyId: tenantToEdit?.propertyId || undefined,
      apartmentUnit: tenantToEdit?.apartmentUnit || "",
      leaseStartDate: tenantToEdit?.leaseStartDate ? parseISO(tenantToEdit.leaseStartDate) : undefined,
      leaseEndDate: tenantToEdit?.leaseEndDate ? parseISO(tenantToEdit.leaseEndDate) : undefined,
      rent_paid_status: tenantToEdit?.rent_paid_status || "Pendente",
      iptuAmount: tenantToEdit?.iptuAmount || 0,
      iptuDueDate: tenantToEdit?.iptuDueDate ? parseISO(tenantToEdit.iptuDueDate) : undefined,
      iptuStatus: tenantToEdit?.iptuStatus || "Pendente",
      tcrAmount: tenantToEdit?.tcrAmount || 0,
      tcrDueDate: tenantToEdit?.tcrDueDate ? parseISO(tenantToEdit.tcrDueDate) : undefined,
      tcrStatus: tenantToEdit?.tcrStatus || "Pendente",
    },
  });

  async function onSubmit(values: z.infer<typeof addTenantFormSchema>) {
    setIsLoading(true);
    
    const { confirmPassword, ...submissionValues } = values;

    const formattedValues = {
        ...submissionValues,
        leaseStartDate: format(values.leaseStartDate, "yyyy-MM-dd"),
        leaseEndDate: format(values.leaseEndDate, "yyyy-MM-dd"),
        iptuDueDate: values.iptuDueDate ? format(values.iptuDueDate, "yyyy-MM-dd") : undefined,
        tcrDueDate: values.tcrDueDate ? format(values.tcrDueDate, "yyyy-MM-dd") : undefined,
        role: 'tenant' as const,
        // Apenas inclui a senha se ela foi fornecida (ou seja, não é vazia)
        password: values.password ? values.password : (isEditing ? tenantToEdit?.password : undefined),
    };
    
    // Se estiver editando e a senha não foi alterada, não enviar o campo password
    if (isEditing && !values.password) {
      delete (formattedValues as any).password;
    }


    if (isEditing) {
      console.log("Dados do inquilino atualizados (simulado):", { ...tenantToEdit, ...formattedValues, id: tenantToEdit.id });
      // Em uma app real: mockTenants = mockTenants.map(t => t.id === tenantToEdit.id ? { ...t, ...formattedValues, id: tenantToEdit.id } : t);
    } else {
      console.log("Dados do novo inquilino (simulado):", { id: `t${Date.now()}`, ...formattedValues });
      // Em uma app real: mockTenants.push({ id: `t${Date.now()}`, ...formattedValues });
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    toast({
      title: isEditing ? "Inquilino Atualizado!" : "Inquilino Adicionado!",
      description: `O inquilino "${values.name}" foi ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso (simulação).`,
    });
    router.push("/landlord/tenants");
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className="text-lg font-medium text-primary border-b pb-2">Informações Pessoais e de Acesso</h3>
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
                <FormLabel>Email (para login)</FormLabel>
                <FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl><Input type="password" placeholder={isEditing ? "Deixe em branco para não alterar" : "••••••••"} {...field} /></FormControl>
              {isEditing && <FormDescription>Deixe em branco se não desejar alterar a senha.</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl><Input type="password" placeholder={isEditing ? "Deixe em branco para não alterar" : "••••••••"} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
            control={form.control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RG</FormLabel>
                <FormControl><Input placeholder="0.000.000 SSP/PB" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado Civil</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione o estado civil" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {maritalStatusOptions.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="profession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profissão</FormLabel>
                <FormControl><Input placeholder="Ex: Engenheiro(a), Professor(a)" {...field} /></FormControl>
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

        <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Status Financeiro</h3>
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
            {isEditing ? "Salvar Alterações" : "Salvar Inquilino"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
