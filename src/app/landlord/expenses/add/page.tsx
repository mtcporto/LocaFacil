
import AddExpenseForm from "@/components/expense/AddExpenseForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddExpensePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Adicionar Nova Despesa</h1>
          <p className="text-muted-foreground">Preencha os detalhes abaixo para registrar uma nova despesa.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/landlord/expenses">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Despesas
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Detalhes da Despesa</CardTitle>
          <CardDescription>Forneça informações completas sobre a despesa.</CardDescription>
        </CardHeader>
        <CardContent>
          <AddExpenseForm />
        </CardContent>
      </Card>
    </div>
  );
}
