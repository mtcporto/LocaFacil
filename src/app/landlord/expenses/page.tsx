
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockExpenses, getPropertyNameById } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('pt-BR');
};

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'Manutenção': return 'bg-orange-100 text-orange-700 border-orange-300';
    case 'Pessoal': return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'Administrativo': return 'bg-purple-100 text-purple-700 border-purple-300';
    case 'Marketing': return 'bg-pink-100 text-pink-700 border-pink-300';
    case 'Impostos': return 'bg-red-100 text-red-700 border-red-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};

export default function LandlordExpensesPage() {
  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <Receipt className="mr-3 h-8 w-8" />
            Gerenciar Despesas
          </h1>
          <p className="text-muted-foreground">Acompanhe todas as despesas operacionais e de imóveis.</p>
        </div>
        <Button asChild>
          <Link href="/landlord/expenses/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Nova Despesa
          </Link>
        </Button>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Despesas</CardTitle>
          <CardDescription>Um resumo de todas as despesas registradas.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockExpenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Imóvel</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getCategoryBadgeClass(expense.category)}>
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getPropertyNameById(expense.propertyId)}</TableCell>
                    <TableCell className="text-right">{expense.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" title="Editar Despesa (simulado)">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir Despesa (simulado)">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhuma despesa registrada ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
