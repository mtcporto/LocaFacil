
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CalendarDays, UserCircle, Home, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function TenantLeasePage() {
  const { toast } = useToast();

  // Mock lease data - in a real app, this would be fetched
  const leaseDetails = {
    propertyName: "Edificio Lest Ville - Unidade 305",
    address: "Av. Cabo Branco, 2834, João Pessoa, PB",
    tenantName: "Nome do Inquilino Atual",
    landlordName: "Construtora Earlen Ltda",
    leaseStartDate: "2023-07-01",
    leaseEndDate: "2024-06-30",
    rentAmount: 950.00,
    rentDueDate: "Dia 5 de cada mês",
    securityDeposit: 2400.00,
    leaseDocumentUrl: "/path/to/mock-lease-document.pdf", // Placeholder
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês (0-indexado) para o construtor Date
    const day = parseInt(parts[2], 10);
    
    const localDate = new Date(year, month, day);
    return localDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDownloadLease = () => {
    // Em uma aplicação real, isso iniciaria o download do arquivo em leaseDetails.leaseDocumentUrl
    // Exemplo: window.open(leaseDetails.leaseDocumentUrl, '_blank');
    // ou <a href={leaseDetails.leaseDocumentUrl} download="contrato.pdf">Baixar</a>
    toast({
      title: "Download Simulado",
      description: `Em uma aplicação real, o download do contrato (${leaseDetails.leaseDocumentUrl}) seria iniciado.`,
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Detalhes do Meu Contrato</h1>
        <p className="text-muted-foreground">Revise os termos e condições do seu contrato de locação atual.</p>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            Resumo do Contrato de Locação
          </CardTitle>
          <CardDescription>
            Imóvel: {leaseDetails.propertyName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><Home className="h-5 w-5 mr-2 text-accent"/>Endereço do Imóvel</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.address}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><UserCircle className="h-5 w-5 mr-2 text-accent"/>Inquilino</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.tenantName}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><UserCircle className="h-5 w-5 mr-2 text-accent"/>Proprietário/Agente</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.landlordName}</p>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-accent"/>Data de Início do Contrato</h3>
              <p className="text-sm text-muted-foreground">{formatDate(leaseDetails.leaseStartDate)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-accent"/>Data de Término do Contrato</h3>
              <p className="text-sm text-muted-foreground">{formatDate(leaseDetails.leaseEndDate)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Aluguel Mensal</h3>
              <p className="text-sm text-muted-foreground">R$ {leaseDetails.rentAmount.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Data de Vencimento do Aluguel</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.rentDueDate}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Depósito de Segurança</h3>
              <p className="text-sm text-muted-foreground">R$ {leaseDetails.securityDeposit.toFixed(2)}</p>
            </div>
          </div>
          
          <Separator />

          <div>
            <Button className="w-full md:w-auto" onClick={handleDownloadLease}>
              <Download className="mr-2 h-4 w-4" /> Baixar Contrato Completo
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Observação: Este é um resumo. Para os termos completos, consulte o documento do contrato completo.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
