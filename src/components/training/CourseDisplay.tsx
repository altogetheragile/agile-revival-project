
import { Course } from "@/types/course";
import { CourseCategory } from "@/components/courses/CourseCategoryTabs";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseScheduleView from "@/components/courses/CourseScheduleView";
import RefreshIndicator from "@/components/training/RefreshIndicator";
import { memo, useEffect } from "react";

interface CourseDisplayProps {
  courses: Course[];
  selectedTab: CourseCategory;
  onTabChange: (tab: CourseCategory) => void;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isAdmin: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const CourseDisplay = memo(({
  courses,
  selectedTab,
  onTabChange,
  isInitialLoading,
  isRefreshing,
  isAdmin,
  onEdit,
  onDelete
}: CourseDisplayProps) => {
  // Log the selected tab and courses for debugging
  useEffect(() => {
    console.log("CourseDisplay: selectedTab", selectedTab);
    console.log("CourseDisplay: courses count", courses.length);
    console.log("CourseDisplay: categories in courses", [...new Set(courses.map(c => c.category))]);
    console.log("CourseDisplay: filtered courses count", 
      selectedTab === "all" ? courses.length : courses.filter(c => c.category === selectedTab).length
    );
  }, [selectedTab, courses]);

  // Get filtered courses based on selected category (with case-insensitive comparison)
  // Compare categories case-insensitively to handle inconsistent DB capitalization
  const filteredCourses = selectedTab.toLowerCase() === "all" 
    ? courses 
    : courses.filter(course => course.category.toLowerCase() === selectedTab.toLowerCase());

  if (isInitialLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading courses...</p>
      </div>
    );
  }

  const handleTabChange = (value: string) => {
    console.log("Tab change handler called with:", value);
    onTabChange(value as CourseCategory);
  };

  return (
    <>
      <CourseFilters
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        filteredCourses={courses} // Pass all courses for proper counting in tabs
      />
      
      <RefreshIndicator isRefreshing={isRefreshing} />
      
      <CourseScheduleView 
        courses={filteredCourses} 
        isAdmin={isAdmin}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
});

CourseDisplay.displayName = "CourseDisplay";

export default CourseDisplay;
