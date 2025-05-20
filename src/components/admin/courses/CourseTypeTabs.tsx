
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CourseTypeTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  eventTypes: string[];
}

export const CourseTypeTabs: React.FC<CourseTypeTabsProps> = ({
  activeTab,
  setActiveTab,
  eventTypes,
}) => {
  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:flex">
          <TabsTrigger value="scheduled">Scheduled Events</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          {eventTypes.filter(type => !['all', 'scheduled', 'templates'].includes(type)).map((type) => (
            <TabsTrigger key={type} value={type} className="hidden md:flex">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
