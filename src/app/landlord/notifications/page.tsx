import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SmartSuggestionsClient from "@/components/notifications/SmartSuggestionsClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Send, Sparkles } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-primary mb-2">Manage Notifications</h1>
        <p className="text-muted-foreground">Communicate with your tenants effectively. Use AI to craft smart notifications.</p>
      </section>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="compose"><Send className="mr-2 h-4 w-4" />Compose Manually</TabsTrigger>
          <TabsTrigger value="ai-suggest"><Sparkles className="mr-2 h-4 w-4" />AI Suggestions</TabsTrigger>
        </TabsList>
        <TabsContent value="compose">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Compose New Notification</CardTitle>
              <CardDescription>Write a message to send to your tenants.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notification-title">Title</Label>
                <Textarea id="notification-title" placeholder="E.g., Important Maintenance Update" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="notification-message">Message</Label>
                <Textarea id="notification-message" placeholder="Enter your notification content here..." rows={5} className="mt-1" />
              </div>
              {/* Add audience selection (all, specific property, specific tenant) here */}
              <Button className="w-full md:w-auto">
                <Send className="mr-2 h-4 w-4" /> Send Notification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-suggest">
            <SmartSuggestionsClient />
        </TabsContent>
      </Tabs>
      
      <Card className="shadow-md">
        <CardHeader>
            <CardTitle>Sent Notifications</CardTitle>
            <CardDescription>History of notifications sent.</CardDescription>
        </CardHeader>
        <CardContent>
            {/* Placeholder for list of sent notifications */}
            <p className="text-muted-foreground">No notifications sent yet.</p>
        </CardContent>
      </Card>
    </div>
  );
}
