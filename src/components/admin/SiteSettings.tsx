import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleDriveSettings } from "./settings/GoogleDriveSettings";
import { GeneralSettings } from "./settings/GeneralSettings";
import { InterfaceSettings } from "./settings/InterfaceSettings";
import { SecuritySettings } from "./settings/SecuritySettings";
import { UserSettings } from "./settings/UserSettings";
import { SocialMediaSettings } from "./settings/SocialMediaSettings";
import { CourseTemplatesSettings } from "./settings/CourseTemplatesSettings";
import { ServicesSettings } from "./settings/ServicesSettings";
import { SiteSettingsProvider } from "@/contexts/site-settings";
import { SettingsHeader } from "./settings/SettingsHeader";
import { SettingsSync } from "./settings/SettingsSync";

const SiteSettings = () => {
  return (
    <SiteSettingsProvider>
      <div className="space-y-6">
        <SettingsHeader />
        <SettingsSync />
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-8 gap-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="socials">Social Media</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
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
          
          <TabsContent value="courses" className="space-y-6">
            <CourseTemplatesSettings />
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-6">
            <GoogleDriveSettings />
          </TabsContent>

          <TabsContent value="socials" className="space-y-6">
            <SocialMediaSettings />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServicesSettings />
          </TabsContent>
        </Tabs>
      </div>
    </SiteSettingsProvider>
  );
};

export default SiteSettings;
