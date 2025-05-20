import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, DollarSign, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TenantPaymentsPage() {
  // Mock payment history data
  const paymentHistory = [
    { id: "pay_1", date: "2024-06-05", amount: 1200.00, status: "Paid", method: "Credit Card" },
    { id: "pay_2", date: "2024-05-05", amount: 1200.00, status: "Paid", method: "Bank Transfer" },
    { id: "pay_3", date: "2024-04-05", amount: 1200.00, status: "Paid", method: "Credit Card" },
    { id: "pay_4", date: "2024-03-07", amount: 1250.00, status: "Late", method: "Credit Card" }, // Example of late payment
  ];

  const nextPayment = {
    dueDate: "2024-07-05",
    amount: 1200.00,
    status: "Due",
  };

  const getStatusIcon = (status: string) => {
    if (status === "Paid") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "Due") return <Clock className="h-4 w-4 text-yellow-500" />;
    if (status === "Late" || status === "Overdue") return <AlertCircle className="h-4 w-4 text-red-500" />;
    return null;
  };
  
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "Paid") return "default"; // Greenish badge
    if (status === "Due") return "outline"; // Yellowish badge
    if (status === "Late" || status === "Overdue") return "destructive"; // Reddish badge
    return "secondary";
  };


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Payment Center</h1>
        <p className="text-muted-foreground">View your payment history and manage upcoming payments.</p>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-6 w-6 text-primary" />
            Next Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">R$ {nextPayment.amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Due by: {new Date(nextPayment.dueDate).toLocaleDateString()}</p>
            </div>
            <Badge variant={getStatusBadgeVariant(nextPayment.status)} className={`px-3 py-1 text-sm ${nextPayment.status === "Paid" ? "bg-green-100 text-green-700 border-green-300" : nextPayment.status === "Due" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-red-100 text-red-700 border-red-300"}`}>
              {getStatusIcon(nextPayment.status)}<span className="ml-1">{nextPayment.status}</span>
            </Badge>
          </div>
          <Button className="w-full md:w-auto">
            <CreditCard className="mr-2 h-4 w-4" /> Make a Payment
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Record of all your past rent payments.</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount (R$)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(payment.status)} className={`px-2 py-0.5 ${payment.status === "Paid" ? "bg-green-100 text-green-700 border-green-300" : payment.status === "Due" ? "bg-yellow-100 text-yellow-700 border-yellow-300" : "bg-red-100 text-red-700 border-red-300"}`}>
                        {getStatusIcon(payment.status)} <span className="ml-1">{payment.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" size="sm" className="text-primary p-0 h-auto">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">No payment history available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
