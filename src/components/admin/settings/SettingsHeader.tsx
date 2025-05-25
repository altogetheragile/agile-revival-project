
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsTabsProps {
  activeTab: string;
  onChange: (value: string) => void;
}

const SettingsHeader: React.FC<SettingsTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="border-b mb-6 pb-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Tabs value={activeTab} onValueChange={onChange}>
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="interface">Interface</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SettingsHeader;
