import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProperties } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandlordPropertiesPage() {
  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Gerenciar Imóveis</h1>
          <p className="text-muted-foreground">Supervisione todos os seus imóveis listados e seus status.</p>
        </div>
        <Button asChild>
          <Link href="/landlord/properties/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Imóvel
          </Link>
        </Button>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Imóveis</CardTitle>
          <CardDescription>Um resumo de todos os imóveis gerenciados por você.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockProperties.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aluguel (R$)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.name}</TableCell>
                    <TableCell>{property.address}, {property.city}</TableCell>
                    <TableCell>
                      <Badge variant={property.available ? "default" : "secondary"} className={property.available ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}>
                        {property.available ? "Disponível" : "Alugado"}
                      </Badge>
                    </TableCell>
                    <TableCell>{property.rent_amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" asChild title="Ver Imóvel">
                        <Link href={`/properties/${property.id}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" title="Editar Imóvel">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir Imóvel">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Você ainda não adicionou nenhum imóvel.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
