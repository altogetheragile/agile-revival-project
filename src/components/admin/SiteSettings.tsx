
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleDriveSettings } from "./settings/GoogleDriveSettings";
import { GeneralSettings } from "./settings/GeneralSettings";
import { InterfaceSettings } from "./settings/InterfaceSettings";
import { SecuritySettings } from "./settings/SecuritySettings";
import { UserSettings } from "./settings/UserSettings";
import { SocialMediaSettings } from "./settings/SocialMediaSettings";
import { ServicesSettings } from "./settings/ServicesSettings";
import { SiteSettingsProvider } from "@/contexts/site-settings";
import { SettingsHeader } from "./settings/SettingsHeader";
import { SettingsSync } from "./settings/SettingsSync";
import { CourseFilterSettings } from "./settings/CourseFilterSettings";
import { TemplateSettings } from "./settings/TemplateSettings";
import { DevModeToggle } from "@/components/dev/DevModeToggle";

const SiteSettings = () => {
  return (
    <SiteSettingsProvider>
      <div className="space-y-6">
        <SettingsHeader />
        <SettingsSync />
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-10 gap-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="interface">Interface</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="socials">Social Media</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="courses">Course Filters</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="devtools" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800">Dev Tools</TabsTrigger>
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

          <TabsContent value="socials" className="space-y-6">
            <SocialMediaSettings />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServicesSettings />
          </TabsContent>
          
          <TabsContent value="courses" className="space-y-6">
            <CourseFilterSettings />
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <TemplateSettings />
          </TabsContent>
          
          <TabsContent value="devtools" className="space-y-6">
            <div className="p-6 border rounded-lg bg-yellow-50">
              <h2 className="text-xl font-bold mb-4">Developer Tools</h2>
              <p className="mb-6 text-gray-600">These tools are intended for development and debugging purposes only.</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Dev Mode</h3>
                <p className="mb-4 text-sm text-gray-500">
                  When enabled, Dev Mode bypasses authentication checks and database connection requirements,
                  allowing you to work with the UI even when backend services are unavailable.
                </p>
                <DevModeToggle />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SiteSettingsProvider>
  );
};

export default SiteSettings;
