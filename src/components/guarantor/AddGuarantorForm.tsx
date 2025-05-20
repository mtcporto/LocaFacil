
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { Loader2, Save } from "lucide-react";
import { maritalStatusOptions } from "@/lib/mockData"; // Assuming you'll add this to mockData

const addGuarantorFormSchema = z.object({
  name: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres." }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido. Formato: XXX.XXX.XXX-XX." }),
  rg: z.string().min(5, { message: "RG deve ter pelo menos 5 caracteres." }),
  maritalStatus: z.string({ required_error: "Selecione o estado civil." }),
  profession: z.string().min(3, { message: "Profissão deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Endereço de email inválido." }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos." }),
  address: z.object({
    street: z.string().min(3, { message: "Logradouro é obrigatório." }),
    number: z.string().min(1, { message: "Número é obrigatório." }),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, { message: "Bairro é obrigatório." }),
    city: z.string().min(2, { message: "Cidade é obrigatória." }),
    state: z.string().length(2, { message: "Estado deve ser a sigla com 2 caracteres (ex: PB)." }),
    zip: z.string().regex(/^\d{5}-?\d{3}$/, { message: "CEP inválido. Formato: XXXXX-XXX ou XXXXXXXX." }),
  }),
});

export default function AddGuarantorForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof addGuarantorFormSchema>>({
    resolver: zodResolver(addGuarantorFormSchema),
    defaultValues: {
      name: "",
      cpf: "",
      rg: "",
      maritalStatus: undefined,
      profession: "",
      email: "",
      phone: "",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zip: "",
      },
    },
  });

  async function onSubmit(values: z.infer<typeof addGuarantorFormSchema>) {
    setIsLoading(true);
    
    console.log("Dados do novo fiador (simulado):", values);
    // Em uma app real: mockGuarantors.push({ id: `g${mockGuarantors.length + 1}`, ...values });

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    toast({
      title: "Fiador Adicionado!",
      description: `O fiador "${values.name}" foi registrado com sucesso (simulação).`,
    });
    router.push("/landlord/guarantors");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h3 className="text-lg font-medium text-primary border-b pb-2">Informações Pessoais do Fiador</h3>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl><Input placeholder="Nome completo do fiador" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <FormField
            control={form.control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RG</FormLabel>
                <FormControl><Input placeholder="0.000.000 SSP/UF" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="maritalStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado Civil</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione o estado civil" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {maritalStatusOptions.map(status => ( // Supondo que maritalStatusOptions esteja em mockData
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
                <FormControl><Input placeholder="Profissão do fiador" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <h3 className="text-lg font-medium text-primary border-b pb-2 pt-4">Endereço do Fiador</h3>
        <FormField
          control={form.control}
          name="address.street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logradouro (Rua/Avenida)</FormLabel>
              <FormControl><Input placeholder="Ex: Rua Principal" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="address.number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl><Input placeholder="Ex: 123" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.complement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento (Opcional)</FormLabel>
                <FormControl><Input placeholder="Ex: Apto 101, Bloco B" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl><Input placeholder="Ex: Centro" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl><Input placeholder="Ex: João Pessoa" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado (Sigla)</FormLabel>
                <FormControl><Input placeholder="Ex: PB" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl><Input placeholder="Ex: 58000-000" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Fiador
          </Button>
        </div>
      </form>
    </Form>
  );
}

    