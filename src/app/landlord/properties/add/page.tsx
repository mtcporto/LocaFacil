import AddPropertyForm from "@/components/property/AddPropertyForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddPropertyPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Adicionar Novo Imóvel</h1>
          <p className="text-muted-foreground">Preencha os detalhes abaixo para cadastrar um novo imóvel na plataforma.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/landlord/properties">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Imóveis
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Detalhes do Imóvel</CardTitle>
          <CardDescription>Forneça informações completas para atrair os melhores inquilinos.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddPropertyForm />
        </CardContent>
      </Card>
    </div>
  );
}
