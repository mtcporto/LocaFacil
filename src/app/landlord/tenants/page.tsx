
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTenants, mockProperties, type TaxStatus } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, MessageSquare, CheckCircle, Clock, AlertTriangle, Circle, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type React from "react";

// Helper function to format date string (YYYY-MM-DD) to DD/MM/YYYY
const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString; // Retorna original se não for YYYY-MM-DD
  const [year, month, day] = parts;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('pt-BR'); // Usar toLocaleDateString para formato local
};

// Helper function to get badge variant, class, and icon for tax status
const getTaxDisplayInfo = (status: TaxStatus | undefined): { variant: "default" | "outline" | "destructive" | "secondary", className: string, icon: React.ElementType, text: string } => {
  switch (status) {
    case 'Pago':
      return { variant: 'default', className: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, text: 'Pago' };
    case 'Pendente':
      return { variant: 'outline', className: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock, text: 'Pendente' };
    case 'Vencido':
      return { variant: 'destructive', className: 'bg-red-100 text-red-700 border-red-300', icon: AlertTriangle, text: 'Vencido' };
    default:
      return { variant: 'secondary', className: 'bg-gray-100 text-gray-700 border-gray-300', icon: Circle, text: 'N/A' };
  }
};


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
          <CardDescription>Um resumo de todos os inquilinos atuais e seus status de pagamento.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockTenants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Imóvel / Unidade</TableHead>
                  <TableHead>Início Contrato</TableHead>
                  <TableHead>Fim Contrato</TableHead>
                  <TableHead>Aluguel</TableHead>
                  <TableHead>IPTU</TableHead>
                  <TableHead>TCR</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTenants.map((tenant) => {
                  const rentInfo = getTaxDisplayInfo(tenant.rent_paid_status);
                  const iptuInfo = getTaxDisplayInfo(tenant.iptuStatus);
                  const tcrInfo = getTaxDisplayInfo(tenant.tcrStatus);
                  
                  return (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>{getPropertyName(tenant.propertyId)} - Unidade {tenant.apartmentUnit}</TableCell>
                      <TableCell>{formatDateForDisplay(tenant.leaseStartDate)}</TableCell>
                      <TableCell>{formatDateForDisplay(tenant.leaseEndDate)}</TableCell>
                      <TableCell>
                        <Badge variant={rentInfo.variant} className={rentInfo.className}>
                          <rentInfo.icon className="mr-1 h-4 w-4" /> {rentInfo.text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={iptuInfo.variant} className={iptuInfo.className}>
                          <iptuInfo.icon className="mr-1 h-4 w-4" /> {iptuInfo.text}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Venc: {formatDateForDisplay(tenant.iptuDueDate)}</p>
                        <p className="text-xs text-muted-foreground">R$ {tenant.iptuAmount.toFixed(2)}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tcrInfo.variant} className={tcrInfo.className}>
                          <tcrInfo.icon className="mr-1 h-4 w-4" /> {tcrInfo.text}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">Venc: {formatDateForDisplay(tenant.tcrDueDate)}</p>
                        <p className="text-xs text-muted-foreground">R$ {tenant.tcrAmount.toFixed(2)}</p>
                      </TableCell>
                      <TableCell className="text-right space-x-1"> {/* Reduced space for more columns */}
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
                  );
                })}
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
