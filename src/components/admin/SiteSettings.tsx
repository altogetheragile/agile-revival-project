
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleDriveSettings } from "./settings/GoogleDriveSettings";
import { GeneralSettings } from "./settings/GeneralSettings";
import { InterfaceSettings } from "./settings/InterfaceSettings";
import { SecuritySettings } from "./settings/SecuritySettings";
import { UserSettings } from "./settings/UserSettings";
import { SiteSettingsProvider } from "@/contexts/SiteSettingsContext";

const SiteSettings = () => {
  const [currentTab, setCurrentTab] = useState<string>("general");

  return (
    <SiteSettingsProvider>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Site Settings</h2>
        
        <Tabs defaultValue="general" value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="interface" className="space-y-6">
            <InterfaceSettings />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <UserSettings />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-6">
            <GoogleDriveSettings />
          </TabsContent>
        </Tabs>
      </div>
    </SiteSettingsProvider>
  );
};

export default SiteSettings;
