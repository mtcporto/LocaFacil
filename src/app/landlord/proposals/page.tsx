
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProposals, mockProperties, type ProposalStatus } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, FileQuestion, Mail, ClipboardList } from "lucide-react";
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

const getStatusDisplayInfo = (status: ProposalStatus): { variant: "default" | "outline" | "destructive" | "secondary", className: string, icon: React.ElementType, text: string } => {
  switch (status) {
    case 'Nova':
      return { variant: 'default', className: 'bg-blue-100 text-blue-700 border-blue-300', icon: Mail, text: 'Nova' };
    case 'Em Análise':
      return { variant: 'outline', className: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: FileQuestion, text: 'Em Análise' };
    case 'Aceita':
      return { variant: 'default', className: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle, text: 'Aceita' };
    case 'Recusada':
      return { variant: 'destructive', className: 'bg-red-100 text-red-700 border-red-300', icon: XCircle, text: 'Recusada' };
    default:
      return { variant: 'secondary', className: 'bg-gray-100 text-gray-700 border-gray-300', icon: ClipboardList, text: status };
  }
};

const getPropertyName = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? property.name : "Imóvel Desconhecido";
}

export default function LandlordProposalsPage() {
  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center">
            <ClipboardList className="mr-3 h-8 w-8" />
            Propostas Recebidas
          </h1>
          <p className="text-muted-foreground">Gerencie e analise propostas de aluguel para seus imóveis.</p>
        </div>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Propostas</CardTitle>
          <CardDescription>Todas as propostas de aluguel submetidas.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockProposals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Proponente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Imóvel Desejado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockProposals.map((proposal) => {
                  const statusInfo = getStatusDisplayInfo(proposal.status);
                  return (
                    <TableRow key={proposal.id}>
                      <TableCell>{formatDate(proposal.dateSubmitted)}</TableCell>
                      <TableCell className="font-medium">{proposal.prospectName}</TableCell>
                      <TableCell>{proposal.prospectEmail}</TableCell>
                      <TableCell>{getPropertyName(proposal.propertyId)}</TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant} className={statusInfo.className}>
                          <statusInfo.icon className="mr-1 h-4 w-4" /> {statusInfo.text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="icon" title="Analisar Proposta (simulado)">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* Futuramente: Ações como Aceitar/Recusar */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhuma proposta recebida no momento.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
