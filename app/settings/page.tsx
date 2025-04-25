import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PincodeChanger from "@/components/PincodeChanger";
import { changeOwnerPin } from "@/lib/auth";
import AppLayout from "../AppLayout";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="security" className="space-y-4">
          <TabsList>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security" className="space-y-4">
            <PincodeChanger onChangePincode={changeOwnerPin} />
          </TabsContent>
          
          <TabsContent value="appearance">
            <div className="text-muted-foreground">
              Appearance settings coming soon...
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="text-muted-foreground">
              Notification settings coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
} 