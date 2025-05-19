
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEventTypes } from "@/services/event/eventTypeService";

interface CourseTypeTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  eventTypes: string[];
}

export const CourseTypeTabs: React.FC<CourseTypeTabsProps> = ({
  activeTab,
  setActiveTab,
  eventTypes: propEventTypes
}) => {
  const [eventTypes, setEventTypes] = useState<{ value: string; label: string }[]>([
    { value: "all", label: "All Types" }
  ]);
  
  // Load event types from database
  useEffect(() => {
    const loadEventTypes = async () => {
      try {
        const dbEventTypes = await getEventTypes();
        
        if (dbEventTypes && dbEventTypes.length > 0) {
          setEventTypes([
            { value: "all", label: "All Types" },
            ...dbEventTypes
          ]);
        }
      } catch (error) {
        console.error("Error loading event types for tabs:", error);
      }
    };
    
    loadEventTypes();
  }, []);
  
  // Filter event types to only show those that are available in the current courses
  const filteredEventTypes = eventTypes.filter(type => 
    type.value === "all" || propEventTypes.includes(type.value)
  );

  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
        <TabsList>
          {filteredEventTypes.map(type => (
            <TabsTrigger key={type.value} value={type.value} className="capitalize">
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
