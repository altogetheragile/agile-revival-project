
import { useState, useMemo } from "react";
import { Course } from "@/types/course";

export const useCourseFiltering = (courses: Course[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("scheduled");
  
  // Extract unique event types for filtering
  const eventTypes = useMemo(() => {
    const types = new Set<string>();
    types.add("scheduled"); // Add tab for scheduled events
    types.add("templates"); // Add tab for templates
    
    courses.forEach(course => {
      if (course.eventType) {
        types.add(course.eventType);
      }
    });
    
    return Array.from(types);
  }, [courses]);

  // Filter courses based on search term and active tab (event type)
  const filteredCourses = useMemo(() => {
    // Apply search filter
    return courses.filter(course => {
      // Don't show templates in scheduled view or vice versa
      if (activeTab === "scheduled" && course.isTemplate) return false;
      if (activeTab === "templates" && !course.isTemplate) return false;
      
      // Handle filtering by specific event type
      if (activeTab !== "scheduled" && activeTab !== "templates" && 
          course.eventType?.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }
      
      // Apply text search
      const matchesSearch = 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.eventType?.toLowerCase().includes(searchTerm.toLowerCase());
        
      return matchesSearch;
    });
  }, [courses, searchTerm, activeTab]);

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredCourses,
    eventTypes
  };
};
