
import AddTenantForm from "@/components/tenant/AddTenantForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddTenantPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Adicionar Novo Inquilino</h1>
          <p className="text-muted-foreground">Preencha os detalhes abaixo para cadastrar um novo inquilino na plataforma.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/landlord/tenants">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Inquilinos
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Detalhes do Inquilino e Contrato</CardTitle>
          <CardDescription>Forneça informações completas sobre o inquilino e os termos do contrato.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddTenantForm />
        </CardContent>
      </Card>
    </div>
  );
}
