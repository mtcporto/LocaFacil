
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, DollarSign, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function TenantPaymentsPage() {
  const { toast } = useToast();

  const paymentHistory = [
    { id: "pay_1", date: "2024-06-05", amount: 950.00, status: "Pago", method: "Cartão de Crédito" }, 
    { id: "pay_2", date: "2024-05-05", amount: 950.00, status: "Pago", method: "Transferência Bancária" }, 
    { id: "pay_3", date: "2024-04-05", amount: 950.00, status: "Pago", method: "Cartão de Crédito" }, 
    { id: "pay_4", date: "2024-03-07", amount: 1000.00, status: "Atrasado", method: "Cartão de Crédito" }, 
  ];

  const nextPayment = {
    dueDate: "2024-07-05",
    amount: 950.00, 
    status: "Pendente", 
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' });
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

  const handleMakePayment = () => {
    toast({
      title: "Redirecionando para Pagamento",
      description: "Em uma aplicação real, você seria direcionado para um portal de pagamentos seguro.",
    });
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
              <p className="text-lg font-semibold">R$ {nextPayment.amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Vencimento: {formatDate(nextPayment.dueDate)}</p>
            </div>
            <Badge variant={getStatusBadgeVariant(nextPayment.status)} className={`px-3 py-1 text-sm ${nextPayment.status === "Pago" ? "bg-green-100 text-green-700 border-green-300" : nextPayment.status === "Pendente" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-red-100 text-red-700 border-red-300"}`}>
              {getStatusIcon(nextPayment.status)}<span className="ml-1">{nextPayment.status}</span>
            </Badge>
          </div>
          <Button className="w-full md:w-auto" onClick={handleMakePayment}>
            <CreditCard className="mr-2 h-4 w-4" /> Fazer Pagamento
          </Button>
        </CardContent>
      </Card>

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
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell>{payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(payment.status)} className={`px-2 py-0.5 ${payment.status === "Pago" ? "bg-green-100 text-green-700 border-green-300" : payment.status === "Pendente" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-red-100 text-red-700 border-red-300"}`}>
                        {getStatusIcon(payment.status)} <span className="ml-1">{payment.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
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
