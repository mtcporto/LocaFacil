
import AddServiceProviderForm from "@/components/provider/AddServiceProviderForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddProviderPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Adicionar Novo Fornecedor</h1>
          <p className="text-muted-foreground">Preencha os detalhes abaixo para registrar um novo prestador de serviço.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/landlord/providers">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Fornecedores
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Detalhes do Fornecedor</CardTitle>
          <CardDescription>Forneça informações completas sobre o prestador de serviço.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddServiceProviderForm />
        </CardContent>
      </Card>
    </div>
  );
}
