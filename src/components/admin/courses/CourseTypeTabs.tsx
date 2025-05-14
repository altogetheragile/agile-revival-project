
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
  eventTypes
}) => {
  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
        <TabsList>
          {eventTypes.map(type => (
            <TabsTrigger key={type} value={type} className="capitalize">
              {type === "all" ? "All Types" : type}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
