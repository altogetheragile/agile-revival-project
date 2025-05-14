
import React, { useState, useEffect, useCallback } from "react";
import { Course } from "@/types/course";
import { CourseCategory } from "@/components/courses/CourseCategoryTabs";
import { getScheduledCourses } from "@/services/courseService";
import CourseDisplay from "./CourseDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const TrainingScheduleContainer = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isAdmin } = useAuth();

  const fetchCourses = useCallback(async () => {
    try {
      console.log("Fetching courses...");
      const scheduledCourses = await getScheduledCourses();
      console.log("Fetched courses:", scheduledCourses);
      setCourses(scheduledCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCategoryChange = (category: CourseCategory) => {
    console.log("TrainingScheduleContainer: Setting category to", category);
    setSelectedCategory(category);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCourses();
  };

  const handleEditCourse = (course: Course) => {
    // This would be implemented if edit functionality is needed
    console.log("Edit course:", course);
  };

  const handleDeleteCourse = (course: Course) => {
    // This would be implemented if delete functionality is needed
    console.log("Delete course:", course);
  };

  return (
    <CourseDisplay
      courses={courses}
      selectedTab={selectedCategory}
      onTabChange={handleCategoryChange}
      isInitialLoading={isLoading}
      isRefreshing={isRefreshing}
      isAdmin={isAdmin}
      onEdit={handleEditCourse}
      onDelete={handleDeleteCourse}
    />
  );
};

export default TrainingScheduleContainer;
