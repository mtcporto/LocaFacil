
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockMaintenanceRequests, mockTenants, mockProperties, type MaintenanceRequestStatus } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Clock, Settings2, ShieldAlert, Wrench } from "lucide-react";
import Link from "next/link";
import type React from "react";

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return date.toLocaleDateString('pt-BR');
};

const getStatusDisplayInfo = (status: MaintenanceRequestStatus): { variant: "default" | "outline" | "destructive" | "secondary", className: string, icon: React.ElementType, text: string } => {
  switch (status) {
    case 'Pendente':
      return { variant: 'outline', className: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock, text: 'Pendente' };
    case 'Em Andamento':
      return { variant: 'default', className: 'bg-blue-100 text-blue-700 border-blue-300', icon: Settings2, text: 'Em Andamento' };
    case 'Concluído':
      return { variant: 'default', className: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, text: 'Concluído' };
    case 'Cancelado':
      return { variant: 'destructive', className: 'bg-gray-100 text-gray-700 border-gray-300', icon: ShieldAlert, text: 'Cancelado' }; // Using ShieldAlert for 'Cancelado'
    default:
      return { variant: 'secondary', className: 'bg-gray-100 text-gray-700 border-gray-300', icon: Wrench, text: status };
  }
};

const getTenantName = (tenantId: string) => {
    const tenant = mockTenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : "Desconhecido";
};

const getPropertyName = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? property.name : "Desconhecido";
}

export default function LandlordMaintenancePage() {
  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <Wrench className="mr-3 h-8 w-8" />
            Solicitações de Manutenção
          </h1>
          <p className="text-muted-foreground">Gerencie e acompanhe os pedidos de manutenção dos inquilinos.</p>
        </div>
        {/* Futuramente: Botão para "Adicionar Solicitação Manualmente" */}
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Solicitações</CardTitle>
          <CardDescription>Todas as solicitações de manutenção registradas.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockMaintenanceRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Inquilino</TableHead>
                  <TableHead>Imóvel / Unidade</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMaintenanceRequests.map((request) => {
                  const statusInfo = getStatusDisplayInfo(request.status);
                  return (
                    <TableRow key={request.id}>
                      <TableCell>{formatDate(request.dateSubmitted)}</TableCell>
                      <TableCell className="font-medium">{getTenantName(request.tenantId)}</TableCell>
                      <TableCell>{getPropertyName(request.propertyId)} - Unid. {request.unit}</TableCell>
                      <TableCell className="max-w-xs truncate" title={request.description}>{request.description}</TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant} className={statusInfo.className}>
                          <statusInfo.icon className="mr-1 h-4 w-4" /> {statusInfo.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" title="Ver Detalhes (simulado)">
                          <Eye className="h-4 w-4" />
                        </Button>
                         {/* Futuramente: <Button variant="outline" size="sm">Mudar Status</Button> */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhuma solicitação de manutenção registrada.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
