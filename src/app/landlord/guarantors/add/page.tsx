
import AddGuarantorForm from "@/components/guarantor/AddGuarantorForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddGuarantorPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Adicionar Novo Fiador</h1>
          <p className="text-muted-foreground">Preencha os detalhes abaixo para registrar um novo fiador.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/landlord/guarantors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Fiadores
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Detalhes do Fiador</CardTitle>
          <CardDescription>Forneça informações completas sobre o fiador.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddGuarantorForm />
        </CardContent>
      </Card>
    </div>
  );
}

    