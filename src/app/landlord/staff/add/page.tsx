
import AddEmployeeForm from "@/components/staff/AddEmployeeForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddEmployeePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Adicionar Novo Colaborador</h1>
          <p className="text-muted-foreground">Preencha os detalhes abaixo para registrar um novo colaborador.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/landlord/staff">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Colaboradores
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Detalhes do Colaborador</CardTitle>
          <CardDescription>Forneça informações completas sobre o colaborador.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddEmployeeForm />
        </CardContent>
      </Card>
    </div>
  );
}
