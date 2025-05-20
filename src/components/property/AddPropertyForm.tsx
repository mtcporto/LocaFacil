
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { Loader2, Save } from "lucide-react";
import type { PropertyAmenity } from "@/lib/mockData";

const propertyAmenitiesList: { id: PropertyAmenity; label: string }[] = [
  { id: "Estacionamento", label: "Estacionamento" },
  { id: "Piscina", label: "Piscina" },
  { id: "Academia", label: "Academia" },
  { id: "Aceita Pets", label: "Aceita Pets" },
  { id: "Mobiliado", label: "Mobiliado" },
  { id: "Varanda", label: "Varanda" },
];

const addPropertyFormSchema = z.object({
  name: z.string().min(3, { message: "Nome do imóvel deve ter pelo menos 3 caracteres." }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres." }),
  city: z.string().min(2, { message: "Cidade deve ter pelo menos 2 caracteres." }),
  state: z.string().length(2, { message: "Estado deve ser a sigla com 2 caracteres (ex: PB)." }),
  zip: z.string().regex(/^\d{5}-?\d{3}$/, { message: "CEP inválido. Formato: XXXXX-XXX ou XXXXXXXX." }),
  description: z.string().min(10, { message: "Descrição curta deve ter pelo menos 10 caracteres." }).max(250, { message: "Descrição curta não pode exceder 250 caracteres." }),
  longDescription: z.string().min(50, { message: "Descrição longa deve ter pelo menos 50 caracteres." }),
  sq_m: z.coerce.number({ invalid_type_error: "Área deve ser um número." }).positive({ message: "Área deve ser um valor positivo." }),
  bedrooms: z.coerce.number({ invalid_type_error: "Número de quartos deve ser um número." }).int().min(0, { message: "Número de quartos não pode ser negativo." }),
  bathrooms: z.coerce.number({ invalid_type_error: "Número de banheiros deve ser um número." }).int().min(1, { message: "Deve ter pelo menos 1 banheiro." }),
  rent_amount: z.coerce.number({ invalid_type_error: "Valor do aluguel deve ser um número." }).positive({ message: "Valor do aluguel deve ser positivo." }),
  type: z.enum(["Apartamento", "Casa", "Condomínio"], { required_error: "Selecione o tipo do imóvel." }),
  amenities: z.array(z.string()).optional(),
  available: z.string({ required_error: "Selecione o status de disponibilidade." }), // Receber como string do Select
});

export default function AddPropertyForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof addPropertyFormSchema>>({
    resolver: zodResolver(addPropertyFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      description: "",
      longDescription: "",
      sq_m: 0,
      bedrooms: 1,
      bathrooms: 1,
      rent_amount: 0,
      type: undefined,
      amenities: [],
      available: "true",
    },
  });

  async function onSubmit(values: z.infer<typeof addPropertyFormSchema>) {
    setIsLoading(true);
    
    // Simulação de chamada de API
    console.log("Dados do novo imóvel (simulado):", {
        ...values,
        available: values.available === "true", // Converte para boolean
        amenities: values.amenities as PropertyAmenity[], // Cast para o tipo correto
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    toast({
      title: "Imóvel Adicionado!",
      description: `O imóvel "${values.name}" foi cadastrado com sucesso (simulação).`,
    });
    router.push("/landlord/properties");
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
                <FormLabel>Nome do Imóvel / Empreendimento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Edifício Sol Nascente, Residencial Flores" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço (Logradouro e Número)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Rua das Acácias, 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="city"
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
          <FormField
            control={form.control}
            name="state"
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
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: 58000-000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição Curta (para listagens)</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Um breve resumo atraente do imóvel..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="longDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição Longa (para página de detalhes)</FormLabel>
              <FormControl>
                <Textarea rows={6} placeholder="Detalhes completos sobre o imóvel, características, vizinhança, etc..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormField
            control={form.control}
            name="sq_m"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área (m²)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 75" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quartos</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banheiros</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Ex: 2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rent_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor do Aluguel (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Ex: 1500.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Imóvel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Condomínio">Condomínio</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status de Disponibilidade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Disponível</SelectItem>
                    <SelectItem value="false">Alugado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Comodidades</FormLabel>
                <FormDescription>
                  Selecione as comodidades que o imóvel oferece.
                </FormDescription>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {propertyAmenitiesList.map((amenityItem) => (
                  <FormField
                    key={amenityItem.id}
                    control={form.control}
                    name="amenities"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={amenityItem.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenityItem.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), amenityItem.id])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== amenityItem.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {amenityItem.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Salvar Imóvel
          </Button>
        </div>
      </form>
    </Form>
  );
}
