import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CalendarDays, UserCircle, Home, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function TenantLeasePage() {
  // Mock lease data - in a real app, this would be fetched
  const leaseDetails = {
    propertyName: "Edificio Lest Ville - Unit 305",
    address: "Av. Cabo Branco, 2834, João Pessoa, PB",
    tenantName: "Current Tenant Name",
    landlordName: "Construtora Earlen Ltda",
    leaseStartDate: "2023-07-01",
    leaseEndDate: "2024-06-30",
    rentAmount: 1200.00,
    rentDueDate: "5th of each month",
    securityDeposit: 2400.00,
    leaseDocumentUrl: "/path/to/mock-lease-document.pdf", // Placeholder
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">My Lease Details</h1>
        <p className="text-muted-foreground">Review the terms and conditions of your current lease agreement.</p>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            Lease Agreement Overview
          </CardTitle>
          <CardDescription>
            Property: {leaseDetails.propertyName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><Home className="h-5 w-5 mr-2 text-accent"/>Property Address</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.address}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><UserCircle className="h-5 w-5 mr-2 text-accent"/>Tenant</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.tenantName}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><UserCircle className="h-5 w-5 mr-2 text-accent"/>Landlord/Agent</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.landlordName}</p>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-accent"/>Lease Start Date</h3>
              <p className="text-sm text-muted-foreground">{formatDate(leaseDetails.leaseStartDate)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground flex items-center"><CalendarDays className="h-5 w-5 mr-2 text-accent"/>Lease End Date</h3>
              <p className="text-sm text-muted-foreground">{formatDate(leaseDetails.leaseEndDate)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Monthly Rent</h3>
              <p className="text-sm text-muted-foreground">R$ {leaseDetails.rentAmount.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Rent Due Date</h3>
              <p className="text-sm text-muted-foreground">{leaseDetails.rentDueDate}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-foreground">Security Deposit</h3>
              <p className="text-sm text-muted-foreground">R$ {leaseDetails.securityDeposit.toFixed(2)}</p>
            </div>
          </div>
          
          <Separator />

          <div>
            <Button className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" /> Download Full Lease Document
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Note: This is a summary. For complete terms, please refer to the full lease document.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
