import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function TenantNotificationsPage() {
  // Mock notification data
  const notifications = [
    { id: "n1", title: "Important: Water Outage Tomorrow Morning", date: "2024-07-10", content: "Please be advised that there will be a temporary water outage tomorrow, July 11th, from 9 AM to 12 PM due to essential maintenance. We apologize for any inconvenience.", read: false, type: "Urgent" },
    { id: "n2", title: "Community BBQ Next Saturday!", date: "2024-07-08", content: "Join us for a community BBQ in the common area next Saturday, July 20th, at 2 PM. Food and drinks will be provided!", read: false, type: "Event" },
    { id: "n3", title: "Reminder: Rent Due Soon", date: "2024-07-01", content: "This is a friendly reminder that your rent payment is due on July 5th. You can make payments through the tenant portal.", read: true, type: "Reminder" },
    { id: "n4", title: "Gym Renovation Complete", date: "2024-06-25", content: "We are pleased to announce that the gym renovation is complete and it is now open for use. Enjoy the new equipment!", read: true, type: "Amenity" },
  ];

  const getBadgeVariant = (type: string): "default" | "destructive" | "secondary" | "outline" => {
    switch (type) {
      case "Urgent": return "destructive";
      case "Event": return "default";
      case "Reminder": return "outline";
      default: return "secondary";
    }
  }
  
  const getBadgeClass = (type: string): string => {
    switch (type) {
      case "Urgent": return "bg-red-100 text-red-700 border-red-300";
      case "Event": return "bg-blue-100 text-blue-700 border-blue-300"; // Primary based
      case "Reminder": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300"; // Muted/Secondary based
    }
  }


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">My Notifications</h1>
        <p className="text-muted-foreground">Stay up-to-date with important announcements and updates from the management.</p>
      </section>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-6 w-6 text-primary" />
            Notification Feed
          </CardTitle>
          <CardDescription>
            All messages and alerts related to your tenancy and building.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-6">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className={`p-4 rounded-lg border ${!notification.read ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className={`text-lg font-semibold ${!notification.read ? 'text-primary' : 'text-foreground'}`}>{notification.title}</h3>
                        <p className="text-xs text-muted-foreground">{new Date(notification.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getBadgeVariant(notification.type)} className={getBadgeClass(notification.type)}>{notification.type}</Badge>
                        {!notification.read && (
                          <span title="Unread" className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{notification.content}</p>
                  </div>
                  {index < notifications.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No notifications at the moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
