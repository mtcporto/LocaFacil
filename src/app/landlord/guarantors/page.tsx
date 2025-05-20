
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockGuarantors } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, ShieldCheck, Phone, Mail } from "lucide-react";

export default function LandlordGuarantorsPage() {
  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <ShieldCheck className="mr-3 h-8 w-8" />
            Gerenciar Fiadores
          </h1>
          <p className="text-muted-foreground">Cadastre e visualize os fiadores dos contratos de locação.</p>
        </div>
        <Button asChild>
          <Link href="/landlord/guarantors/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Fiador
          </Link>
        </Button>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Fiadores</CardTitle>
          <CardDescription>Um resumo de todos os fiadores registrados.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockGuarantors.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Endereço Principal</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockGuarantors.map((guarantor) => (
                  <TableRow key={guarantor.id}>
                    <TableCell className="font-medium">{guarantor.name}</TableCell>
                    <TableCell>{guarantor.cpf}</TableCell>
                    <TableCell>
                        <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" /> {guarantor.phone}
                        </div>
                        {guarantor.email && (
                            <div className="flex items-center text-sm mt-1">
                                <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" /> {guarantor.email}
                            </div>
                        )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                        {guarantor.address.street}, {guarantor.address.number} - {guarantor.address.neighborhood}, {guarantor.address.city}/{guarantor.address.state}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" title="Editar Fiador (simulado)">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir Fiador (simulado)">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum fiador registrado ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    