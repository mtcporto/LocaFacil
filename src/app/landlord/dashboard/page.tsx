import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building, Users, Bell, PlusCircle, ArrowRight } from "lucide-react";

export default function LandlordDashboardPage() {
  const stats = [
    { title: "Total Properties", value: "12", icon: Building, color: "text-primary" },
    { title: "Occupied Units", value: "150", icon: Users, color: "text-green-500" },
    { title: "Vacant Units", value: "8", icon: Users, color: "text-orange-500" },
    { title: "Pending Notifications", value: "3", icon: Bell, color: "text-yellow-500" },
  ];

  const quickLinks = [
    { href: "/landlord/properties/add", label: "Add New Property", icon: PlusCircle },
    { href: "/landlord/notifications", label: "Send Notification", icon: Bell },
    { href: "/landlord/tenants", label: "View All Tenants", icon: Users },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Landlord Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your properties and activities.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Current status</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Perform common tasks quickly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickLinks.map((link) => (
              <Button key={link.href} variant="outline" className="w-full justify-start" asChild>
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
             <CardDescription>Latest updates and tenant interactions.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent activity feed */}
            <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between p-2 bg-secondary/30 rounded-md"><span>New lease application for Unit 201, Lest Ville</span> <span className="text-muted-foreground">2h ago</span></li>
                <li className="flex items-center justify-between p-2 bg-secondary/30 rounded-md"><span>Maintenance request for Apt 5B, Manaira Prime</span> <span className="text-muted-foreground">1d ago</span></li>
                <li className="flex items-center justify-between p-2 bg-secondary/30 rounded-md"><span>Notification sent: "Holiday Greetings"</span> <span className="text-muted-foreground">3d ago</span></li>
            </ul>
            <Button variant="link" className="mt-4 px-0 text-primary" asChild>
              <Link href="#">View all activity <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
