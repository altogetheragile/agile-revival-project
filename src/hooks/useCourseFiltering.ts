
import { useState } from "react";
import { Course } from "@/types/course";

export const useCourseFiltering = (courses: Course[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter courses by event type and search term
  const filteredCourses = courses.filter(course => {
    // First apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = course.title.toLowerCase().includes(searchLower) ||
        (course.eventType && course.eventType.toLowerCase().includes(searchLower)) ||
        course.category.toLowerCase().includes(searchLower) ||
        (course.instructor && course.instructor.toLowerCase().includes(searchLower)) ||
        (course.location && course.location.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    // Then apply event type filter
    if (activeTab === "all") return true;
    return course.eventType === activeTab;
  });
  
  // Get unique event types for tabs
  const eventTypes = ["all", ...Array.from(new Set(courses.map(c => c.eventType || "course")))];

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredCourses,
    eventTypes
  };
};
