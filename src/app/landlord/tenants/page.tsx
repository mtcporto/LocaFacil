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
    return prop ? prop.name : "Unknown Property";
  }

  return (
    <div className="space-y-8">
      <section className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Manage Tenants</h1>
          <p className="text-muted-foreground">View and manage all your tenants.</p>
        </div>
        <Button asChild>
          <Link href="/landlord/tenants/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Tenant
          </Link>
        </Button>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Tenant List</CardTitle>
          <CardDescription>A summary of all current tenants.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockTenants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Property / Unit</TableHead>
                  <TableHead>Rent Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>{tenant.email}</TableCell>
                    <TableCell>{getPropertyName(tenant.propertyId)} - Unit {tenant.apartmentUnit}</TableCell>
                    <TableCell>
                       <Badge variant={
                          tenant.rent_paid_status === "Paid" ? "default" : 
                          tenant.rent_paid_status === "Due" ? "outline" : "destructive" 
                        }
                        className={
                          tenant.rent_paid_status === "Paid" ? "bg-green-100 text-green-700 border-green-300" :
                          tenant.rent_paid_status === "Due" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                          "bg-red-100 text-red-700 border-red-300"
                        }
                       >
                        {tenant.rent_paid_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" title="Message Tenant">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Edit Tenant">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Delete Tenant">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">You don&apos;t have any tenants yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
