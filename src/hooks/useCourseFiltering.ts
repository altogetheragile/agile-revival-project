
import { useState, useMemo } from "react";
import { Course } from "@/types/course";

export const useCourseFiltering = (courses: Course[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Extract unique event types for filtering
  const eventTypes = useMemo(() => {
    const types = new Set<string>();
    types.add("all"); // Always include "all" option
    
    courses.forEach(course => {
      if (course.eventType) {
        types.add(course.eventType);
      }
    });
    
    return Array.from(types);
  }, [courses]);

  // Filter courses based on search term and active tab (event type)
  const filteredCourses = useMemo(() => {
    // Filter out templates - we want to show only schedulable events
    const nonTemplates = courses.filter(course => !course.isTemplate);
    
    // Then apply search and tab filters
    return nonTemplates.filter(course => {
      const matchesSearch = 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.eventType?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesTab = 
        activeTab === "all" || 
        course.eventType?.toLowerCase() === activeTab.toLowerCase();
        
      return matchesSearch && matchesTab;
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
