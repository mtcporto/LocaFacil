
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
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { Loader2, Save } from "lucide-react";

// Valores atuais do rodapé como default (para simulação)
const constructorData = {
  nome: "CONSTRUTORA EARLEN",
  logradouro: "Avenida Governador Flávio Ribeiro Coutinho",
  numero: "707",
  complemento: "Sala 219",
  bairro: "Manaíra",
  cidade: "João Pessoa",
  estado: "PB",
  cep: "58037-000",
  telefone: "(83) 3246-1640",
  whatsapp: "+55 83 8884-0081",
  email: "contato@earlen.com.br" // Adicionando um email de exemplo
};

const constructorFormSchema = z.object({
  nome: z.string().min(1, { message: "Nome da construtora é obrigatório." }),
  logradouro: z.string().min(1, { message: "Logradouro é obrigatório." }),
  numero: z.string().min(1, { message: "Número é obrigatório." }),
  complemento: z.string().optional(),
  bairro: z.string().min(1, { message: "Bairro é obrigatório." }),
  cidade: z.string().min(1, { message: "Cidade é obrigatória." }),
  estado: z.string().min(1, { message: "Estado é obrigatório." }).max(2, { message: "Use a sigla do estado (ex: PB)." }),
  cep: z.string().min(8, { message: "CEP deve ter 8 dígitos." }).regex(/^\d{5}-\d{3}$|^\d{8}$/, { message: "CEP inválido. Use XXXXX-XXX ou XXXXXXXX." }),
  telefone: z.string().min(10, { message: "Telefone inválido." }),
  whatsapp: z.string().min(10, { message: "WhatsApp inválido." }),
  email: z.string().email({ message: "Email inválido." }).optional().or(z.literal('')),
});

export default function ConstructorInfoForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof constructorFormSchema>>({
    resolver: zodResolver(constructorFormSchema),
    defaultValues: {
      nome: constructorData.nome,
      logradouro: constructorData.logradouro,
      numero: constructorData.numero,
      complemento: constructorData.complemento,
      bairro: constructorData.bairro,
      cidade: constructorData.cidade,
      estado: constructorData.estado,
      cep: constructorData.cep,
      telefone: constructorData.telefone,
      whatsapp: constructorData.whatsapp,
      email: constructorData.email,
    },
  });

  async function onSubmit(values: z.infer<typeof constructorFormSchema>) {
    setIsLoading(true);
    // Simula chamada de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    console.log("Valores do formulário (simulado):", values);
    toast({
      title: "Configurações Salvas!",
      description: "As informações da construtora foram atualizadas (simulação).",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Construtora</FormLabel>
              <FormControl>
                <Input placeholder="Nome da Construtora" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="logradouro"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Logradouro</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Av. Principal, Rua das Palmeiras" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="numero"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Número</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: 123, S/N" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="complemento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sala 101, Bloco B, Apto 202" {...field} />
              </FormControl>
              <FormDescription>Opcional.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="bairro"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Centro, Manaíra" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: João Pessoa" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Estado (Sigla)</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: PB" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
                <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: 58000-000 ou 58000000" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                    <Input placeholder="(XX) XXXX-XXXX" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
                <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                    <Input placeholder="+55 XX XXXXX-XXXX" {...field} />
                </FormControl>
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contato@construtora.com.br" {...field} />
              </FormControl>
              <FormDescription>Opcional.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Salvar Alterações
        </Button>
      </form>
    </Form>
  );
}
