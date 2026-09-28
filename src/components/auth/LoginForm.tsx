"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import React from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Endereço de email inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      toast({title: "Login bem-sucedido", description: "Abrindo seu portal seguro..."});
      window.location.assign(result.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard');
    } catch {
      toast({
        variant: "destructive",
        title: "Falha no login",
        description: "Email ou senha inválidos.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="voce@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Entrar
        </Button>
        <div className="relative py-1 text-center text-xs text-muted-foreground before:absolute before:left-0 before:right-0 before:top-1/2 before:border-t before:border-border">
          <span className="relative bg-card px-3">ou</span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-full border-slate-300 bg-white font-semibold text-slate-800 shadow-sm hover:bg-slate-50 hover:text-slate-900"
          asChild
        >
          <a href="/api/auth/google">
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M21.35 12.27c0-.71-.06-1.4-.18-2.06H12v3.9h5.24a4.48 4.48 0 0 1-1.94 2.94v2.51h3.23c1.89-1.74 2.82-4.3 2.82-7.29Z" />
              <path fill="#34A853" d="M12 21.5c2.7 0 4.96-.9 6.62-2.43l-3.23-2.51c-.9.6-2.05.95-3.39.95-2.61 0-4.82-1.76-5.61-4.13H3.05v2.59A10 10 0 0 0 12 21.5Z" />
              <path fill="#FBBC05" d="M6.39 13.38A6.02 6.02 0 0 1 6.07 12c0-.48.11-.95.32-1.38V8.03H3.05A9.5 9.5 0 0 0 2 12c0 1.43.34 2.79 1.05 3.97l3.34-2.59Z" />
              <path fill="#EA4335" d="M12 6.49c1.47 0 2.79.51 3.83 1.51l2.87-2.87C16.95 3.48 14.7 2.5 12 2.5a10 10 0 0 0-8.95 5.53l3.34 2.59C7.18 8.25 9.39 6.49 12 6.49Z" />
            </svg>
            Continuar com Google
          </a>
        </Button>
      </form>
    </Form>
  );
}
