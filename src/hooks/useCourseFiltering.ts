
import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { getEventTypes } from "@/services/event/eventTypeService";

export const useCourseFiltering = (courses: Course[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [availableEventTypes, setAvailableEventTypes] = useState<string[]>(["all"]);

  // Load event types from database
  useEffect(() => {
    const loadEventTypes = async () => {
      try {
        const types = await getEventTypes();
        if (types && types.length > 0) {
          setAvailableEventTypes(["all", ...types.map(type => type.value)]);
        }
      } catch (error) {
        console.error("Error loading event types for filtering:", error);
      }
    };
    
    loadEventTypes();
  }, []);

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
  
  // Get unique event types from the courses for tabs
  const courseEventTypes = Array.from(new Set(courses.map(c => c.eventType || "course")));
  
  // Combine available event types with those found in courses
  const eventTypes = Array.from(
    new Set(["all", ...availableEventTypes, ...courseEventTypes])
  );

  return {
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    filteredCourses,
    eventTypes
  };
};
