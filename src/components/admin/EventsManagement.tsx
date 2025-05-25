
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseManagementContainer } from "./courses/CourseManagementContainer";
import { EventTypesSettings } from "./settings/EventTypesSettings";
import { useLocation, useNavigate } from "react-router-dom";

const EventsManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('eventTab');
  
  const [activeTab, setActiveTab] = useState(tabFromUrl || "courses-events");

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(location.search);
    newParams.set('eventTab', value);
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-agile-purple-dark mb-2">Event Management</h2>
        <p className="text-gray-600">Manage courses, events, and event types</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses-events">Courses & Events</TabsTrigger>
          <TabsTrigger value="event-types">Event Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses-events" className="mt-6">
          <CourseManagementContainer />
        </TabsContent>
        
        <TabsContent value="event-types" className="mt-6">
          <EventTypesSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventsManagement;
