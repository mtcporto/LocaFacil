
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
import { mockProperties, type EmployeeRole } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";

const employeeRoles: EmployeeRole[] = ['Porteiro', 'Zelador', 'Faxineiro', 'Administrativo', 'Segurança', 'Outro'];

const addEmployeeFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  role: z.string().min(3, { message: "Cargo é obrigatório." }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos." }),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal('')),
  salary: z.coerce.number({ invalid_type_error: "Salário deve ser um número." }).positive({ message: "Salário deve ser positivo." }),
  hireDate: z.date({ required_error: "Data de contratação é obrigatória." }),
  propertyId: z.string().optional(),
});

export default function AddEmployeeForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof addEmployeeFormSchema>>({
    resolver: zodResolver(addEmployeeFormSchema),
    defaultValues: {
      name: "",
      role: "",
      phone: "",
      email: "",
      salary: 0,
      hireDate: new Date(),
      propertyId: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof addEmployeeFormSchema>) {
    setIsLoading(true);
    
    const formattedValues = {
        ...values,
        hireDate: format(values.hireDate, "yyyy-MM-dd"),
    };

    console.log("Dados do novo colaborador (simulado):", formattedValues);
    // Em uma app real: mockEmployees.push({ id: `emp${mockEmployees.length + 1}`, ...formattedValues });

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    toast({
      title: "Colaborador Adicionado!",
      description: `O colaborador "${values.name}" foi registrado com sucesso (simulação).`,
    });
    router.push("/landlord/staff");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl><Input placeholder="Nome do colaborador" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Cargo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {employeeRoles.map(roleOption => (
                            <SelectItem key={roleOption} value={roleOption}>{roleOption}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    {/* Se precisar de input para "Outro", adicionar lógica aqui */}
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
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email (Opcional)</FormLabel>
                    <FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Salário (R$)</FormLabel>
                <FormControl>
                    <Input type="number" step="0.01" placeholder="Ex: 1500.00" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="hireDate"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Data de Contratação</FormLabel>
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
        
        <FormField
        control={form.control}
        name="propertyId"
        render={({ field }) => (
            <FormItem>
            <FormLabel>Imóvel Alocado (Opcional)</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                <SelectTrigger><SelectValue placeholder="Nenhum imóvel específico" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
                {mockProperties.map(prop => (
                    <SelectItem key={prop.id} value={prop.id}>{prop.name} - {prop.address}</SelectItem>
                ))}
                </SelectContent>
            </Select>
            <FormDescription>Selecione se este colaborador é alocado a um imóvel específico.</FormDescription>
            <FormMessage />
            </FormItem>
        )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Colaborador
          </Button>
        </div>
      </form>
    </Form>
  );
}
