import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTenants, mockProperties } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandlordTenantsPage() {

  const getPropertyName = (propertyId: string) => {
    const prop = mockProperties.find(p => p.id === propertyId);
    return prop ? prop.name : "Imóvel Desconhecido";
  }

  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Gerenciar Inquilinos</h1>
          <p className="text-muted-foreground">Veja e gerencie todos os seus inquilinos.</p>
        </div>
        <Button asChild>
          <Link href="/landlord/tenants/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Novo Inquilino
          </Link>
        </Button>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Inquilinos</CardTitle>
          <CardDescription>Um resumo de todos os inquilinos atuais.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockTenants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Imóvel / Unidade</TableHead>
                  <TableHead>Status do Aluguel</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.email}</TableCell>
                    <TableCell>{getPropertyName(tenant.propertyId)} - Unidade {tenant.apartmentUnit}</TableCell>
                    <TableCell>
                       <Badge variant={
                          tenant.rent_paid_status === "Pago" ? "default" : 
                          tenant.rent_paid_status === "Pendente" ? "outline" : "destructive" 
                        }
                        className={
                          tenant.rent_paid_status === "Pago" ? "bg-green-100 text-green-700 border-green-300" :
                          tenant.rent_paid_status === "Pendente" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                          "bg-red-100 text-red-700 border-red-300"
                        }
                       >
                        {tenant.rent_paid_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" title="Mensagem ao Inquilino">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Editar Inquilino">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir Inquilino">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Você não tem nenhum inquilino ainda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
