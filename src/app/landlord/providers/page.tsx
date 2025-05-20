
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockServiceProviders } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Truck, Phone, Mail, CalendarDays } from "lucide-react";

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('pt-BR');
};

export default function LandlordProvidersPage() {
  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <Truck className="mr-3 h-8 w-8" />
            Gerenciar Fornecedores
          </h1>
          <p className="text-muted-foreground">Cadastre e visualize os prestadores de serviço.</p>
        </div>
        <Button asChild>
          <Link href="/landlord/providers/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Fornecedor
          </Link>
        </Button>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>Um resumo de todos os fornecedores e prestadores de serviço.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockServiceProviders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Tipo de Serviço</TableHead>
                  <TableHead>Contato Principal</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Último Serviço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockServiceProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.companyName}</TableCell>
                    <TableCell>{provider.serviceType}</TableCell>
                    <TableCell>{provider.contactName || '-'}</TableCell>
                    <TableCell>
                        <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" /> {provider.phone}
                        </div>
                    </TableCell>
                    <TableCell>
                        {provider.email ? (
                            <div className="flex items-center text-sm">
                                <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" /> {provider.email}
                            </div>
                        ) : (
                            "-"
                        )}
                    </TableCell>
                    <TableCell>
                        {provider.lastServiceDate ? (
                            <div className="flex items-center text-sm">
                                <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
                                {formatDate(provider.lastServiceDate)}
                            </div>
                        ) : (
                            "N/A"
                        )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" title="Editar Fornecedor (simulado)">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir Fornecedor (simulado)">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum fornecedor registrado ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
