import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, CreditCard, Bell, AlertTriangle, CheckCircle, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TenantDashboardPage() {
  const rentStatus = { status: "Paid", dueDate: "July 5, 2024", amount: 1200 }; // Mock data
  const leaseEndDate = "January 14, 2025"; // Mock data

  const recentNotifications = [
    { id: 1, title: "Elevator Maintenance Scheduled", date: "June 28, 2024", read: false, type: "Maintenance" },
    { id: 2, title: "Pool Area Reopened", date: "June 25, 2024", read: true, type: "Amenity Update" },
    { id: 3, title: "Package Delivery Update", date: "June 20, 2024", read: true, type: "General" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Tenant Dashboard</h1>
        <p className="text-muted-foreground">Welcome! Manage your tenancy and stay updated.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              Rent Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rentStatus.status === "Paid" ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2 h-6 w-6" />
                <span className="text-xl font-semibold">Rent Paid</span>
              </div>
            ) : rentStatus.status === "Due" ? (
              <div className="flex items-center text-orange-600">
                <AlertTriangle className="mr-2 h-6 w-6" />
                <span className="text-xl font-semibold">Rent Due</span>
              </div>
            ) : (
               <div className="flex items-center text-red-600">
                <AlertTriangle className="mr-2 h-6 w-6" />
                <span className="text-xl font-semibold">Rent Overdue</span>
              </div>
            )}
            <p className="text-muted-foreground">Next payment amount: R$ {rentStatus.amount}</p>
            <p className="text-muted-foreground">Due by: {rentStatus.dueDate}</p>
            <Button className="w-full md:w-auto mt-2">
              <CreditCard className="mr-2 h-4 w-4" /> Make a Payment
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Lease Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-foreground">Your current lease is active.</p>
            <p className="text-muted-foreground">Lease end date: {leaseEndDate}</p>
            <Button variant="outline" className="w-full md:w-auto mt-2" asChild>
              <Link href="/tenant/lease">
                View Lease Details
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Recent Notifications
            </CardTitle>
            <CardDescription>Stay informed about building updates and announcements.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentNotifications.length > 0 ? (
              <ul className="space-y-3">
                {recentNotifications.map(notif => (
                  <li key={notif.id} className={`p-3 rounded-md border flex justify-between items-center ${!notif.read ? 'bg-primary/10 border-primary/30' : 'bg-secondary/50'}`}>
                    <div>
                      <h4 className={`font-medium ${!notif.read ? 'text-primary' : 'text-foreground'}`}>{notif.title}</h4>
                      <p className="text-xs text-muted-foreground">{notif.date} - {notif.type}</p>
                    </div>
                    {!notif.read && <Badge variant="default" className="bg-primary">New</Badge>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No new notifications.</p>
            )}
            <Button variant="link" className="mt-4 px-0 text-primary" asChild>
              <Link href="/tenant/notifications">View All Notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
