
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CreditCard, DollarSign, CheckCircle, AlertCircle, Clock, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import React from "react";

export default function TenantPaymentsPage() {
  const { toast } = useToast();
  const [paymentHistory, setPaymentHistory] = React.useState<Array<{id: string; created_at: string; amount: number; status: string; method: string | null}>>([]);
  const [rentAmount, setRentAmount] = React.useState(1);
  const [rentDueDay, setRentDueDay] = React.useState(5);
  const [isCreatingPayment, setIsCreatingPayment] = React.useState(false);
  const [pixPayment, setPixPayment] = React.useState<{qrCode: string; qrCodeBase64?: string; ticketUrl?: string} | null>(null);
  const [isPixCopied, setIsPixCopied] = React.useState(false);

  React.useEffect(() => {
    Promise.all([fetch('/api/payments'), fetch('/api/settings/payments')]).then(async ([paymentsResponse, settingsResponse]) => {
      if (paymentsResponse.ok) setPaymentHistory((await paymentsResponse.json()).payments || []);
      if (settingsResponse.ok) {
        const settings = await settingsResponse.json() as {rentAmount?: number; rentDueDay?: number};
        setRentAmount(settings.rentAmount || 1);
        setRentDueDay(settings.rentDueDay || 5);
      }
    }).catch(() => undefined);
  }, []);

  const nextPayment = {
    status: "Pendente", 
  };
  
  const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString; // Retorna original se não for YYYY-MM-DD
    
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês (0-indexado) para o construtor Date
    const day = parseInt(parts[2], 10);
    
    const localDate = new Date(year, month, day);
    return localDate.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusIcon = (status: string) => {
    if (status === "Pago") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "Pendente") return <Clock className="h-4 w-4 text-yellow-500" />;
    if (status === "Atrasado" || status === "Vencido") return <AlertCircle className="h-4 w-4 text-red-500" />;
    return null;
  };
  
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "Pago") return "default"; 
    if (status === "Pendente") return "outline"; 
    if (status === "Atrasado" || status === "Vencido") return "destructive"; 
    return "secondary";
  };

  const handleCreatePayment = async () => {
    setIsCreatingPayment(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({kind: 'rent'}),
      });
      const data = await response.json() as {checkoutUrl?: string; error?: string};
      if (!response.ok || !data.checkoutUrl) throw new Error(data.error || 'Não foi possível iniciar o pagamento.');
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      toast({variant: 'destructive', title: 'Pagamento indisponível', description: error instanceof Error ? error.message : 'Tente novamente.'});
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handleCreatePix = async () => {
    setIsCreatingPayment(true);
    try {
      const response = await fetch('/api/payments/pix', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({kind: 'rent'})});
      const data = await response.json() as {qrCode?: string; qrCodeBase64?: string; ticketUrl?: string; error?: string};
      if (!response.ok || !data.qrCode) throw new Error(data.error || 'Não foi possível gerar o PIX.');
      setPixPayment({qrCode: data.qrCode, qrCodeBase64: data.qrCodeBase64, ticketUrl: data.ticketUrl});
    } catch (error) {
      toast({variant: 'destructive', title: 'PIX indisponível', description: error instanceof Error ? error.message : 'Tente novamente.'});
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handleViewReceipt = (paymentId: string) => {
     toast({
      title: "Visualizar Recibo",
      description: `Em uma aplicação real, o recibo para o pagamento ${paymentId} seria exibido.`,
    });
  };


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Central de Pagamentos</h1>
        <p className="text-muted-foreground">Veja seu histórico de pagamentos e gerencie os próximos vencimentos.</p>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-6 w-6 text-primary" />
            Próximo Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">R$ {rentAmount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Vencimento: dia {rentDueDay}</p>
            </div>
            <Badge variant={getStatusBadgeVariant(nextPayment.status)} className={`px-3 py-1 text-sm ${nextPayment.status === "Pago" ? "bg-green-100 text-green-700 border-green-300" : nextPayment.status === "Pendente" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-red-100 text-red-700 border-red-300"}`}>
              {getStatusIcon(nextPayment.status)}<span className="ml-1">{nextPayment.status}</span>
            </Badge>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <CreditCard className="mr-2 h-4 w-4" /> Fazer Pagamento
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Pagamento via Mercado Pago</AlertDialogTitle>
                <AlertDialogDescription>
                  Você será levado ao checkout seguro do Mercado Pago para escolher PIX ou cartão e concluir o pagamento de <strong className="text-foreground">R$ {rentAmount.toFixed(2)}</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Fechar</AlertDialogCancel>
                <Button type="button" variant="outline" onClick={handleCreatePix} disabled={isCreatingPayment}>
                  Gerar PIX agora
                </Button>
                <AlertDialogAction onClick={handleCreatePayment} disabled={isCreatingPayment}>
                  {isCreatingPayment ? 'Abrindo checkout...' : 'Continuar para pagar'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      {pixPayment && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>PIX para este pagamento</CardTitle>
            <CardDescription>Escaneie o QR Code ou copie o código no aplicativo do seu banco.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {pixPayment.qrCodeBase64 && <img src={`data:image/png;base64,${pixPayment.qrCodeBase64}`} alt="QR Code PIX" className="h-56 w-56 rounded border p-2" />}
            <div className="w-full space-y-3">
              <p className="break-all rounded-md bg-secondary p-3 font-mono text-xs">{pixPayment.qrCode}</p>
              <Button type="button" variant="outline" onClick={async () => {await navigator.clipboard.writeText(pixPayment.qrCode); setIsPixCopied(true); setTimeout(() => setIsPixCopied(false), 2000);}}>
                {isPixCopied ? <Check className="mr-2 h-4 w-4 text-green-600" /> : <Copy className="mr-2 h-4 w-4" />}
                {isPixCopied ? 'Copiado' : 'Copiar código PIX'}
              </Button>
              {pixPayment.ticketUrl && <a href={pixPayment.ticketUrl} target="_blank" rel="noreferrer" className="block text-sm text-primary underline">Abrir instruções do PIX</a>}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Registro de todos os seus pagamentos de aluguel anteriores.</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor (R$)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Recibo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{formatDate(payment.created_at.slice(0, 10))}</TableCell>
                    <TableCell>{payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(payment.status)} className={`px-2 py-0.5 ${payment.status === "Pago" ? "bg-green-100 text-green-700 border-green-300" : payment.status === "Pendente" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-red-100 text-red-700 border-red-300"}`}>
                        {getStatusIcon(payment.status)} <span className="ml-1">{payment.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.method || 'Mercado Pago'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" size="sm" className="text-primary p-0 h-auto" onClick={() => handleViewReceipt(payment.id)}>Ver</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum histórico de pagamento disponível.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
