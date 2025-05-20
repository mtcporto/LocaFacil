
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockEmployees, getPropertyNameById } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, UsersRound, Phone, Mail, Building } from "lucide-react";

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('pt-BR');
};

export default function LandlordStaffPage() {
  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <UsersRound className="mr-3 h-8 w-8" />
            Gerenciar Colaboradores
          </h1>
          <p className="text-muted-foreground">Visualize e administre os colaboradores da construtora.</p>
        </div>
        <Button asChild>
          <Link href="/landlord/staff/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Colaborador
          </Link>
        </Button>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Colaboradores</CardTitle>
          <CardDescription>Um resumo de todos os colaboradores registrados.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockEmployees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Salário (R$)</TableHead>
                  <TableHead>Data Contratação</TableHead>
                  <TableHead>Imóvel Alocado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                        <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" /> {employee.phone}
                        </div>
                        {employee.email && (
                            <div className="flex items-center text-sm mt-1">
                                <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" /> {employee.email}
                            </div>
                        )}
                    </TableCell>
                    <TableCell>{employee.salary.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(employee.hireDate)}</TableCell>
                    <TableCell>
                        {employee.propertyId ? (
                            <div className="flex items-center text-sm">
                                <Building className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
                                {getPropertyNameById(employee.propertyId)}
                            </div>
                        ) : (
                            "N/A"
                        )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" title="Editar Colaborador (simulado)">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir Colaborador (simulado)">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum colaborador registrado ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
