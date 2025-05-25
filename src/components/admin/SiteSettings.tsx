
import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SettingsHeader from "./settings/SettingsHeader";
import { GeneralSettings } from "./settings/GeneralSettings";
import { InterfaceSettings } from "./settings/InterfaceSettings";
import { SecuritySettings } from "./settings/SecuritySettings";
import { ServicesSettings } from "./settings/ServicesSettings";
import { UserSettings } from "./settings/UserSettings";
import { IntegrationsSettings } from "./settings/IntegrationsSettings";
import { SettingsSync } from "./settings/SettingsSync";

interface SiteSettingsProps {
  initialSection?: string;
}

const SiteSettings: React.FC<SiteSettingsProps> = ({ initialSection }) => {
  const [activeTab, setActiveTab] = useState(initialSection || "general");

  useEffect(() => {
    if (initialSection) {
      setActiveTab(initialSection);
    }
  }, [initialSection]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      <ScrollArea className="flex-1 p-6">
        <div className="container max-w-6xl mx-auto">
          <SettingsHeader activeTab={activeTab} onChange={setActiveTab} />

          <div className="space-y-8">
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "interface" && <InterfaceSettings />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "services" && <ServicesSettings />}
            {activeTab === "integrations" && <IntegrationsSettings />}
            {activeTab === "users" && <UserSettings />}
          </div>
        </div>
      </ScrollArea>
      <SettingsSync />
    </div>
  );
};

export default SiteSettings;
