
import { Course, CourseFormData } from "@/types/course";
import { CourseCategory } from "@/components/courses/CourseCategoryTabs";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseScheduleView from "@/components/courses/CourseScheduleView";
import RefreshIndicator from "@/components/training/RefreshIndicator";
import { memo } from "react";

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
  const filteredCourses = selectedTab === "all" 
    ? courses 
    : courses.filter(course => course.category === selectedTab);

  if (isInitialLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading courses...</p>
      </div>
    );
  }

  return (
    <>
      <CourseFilters
        selectedTab={selectedTab}
        onTabChange={(value) => onTabChange(value as CourseCategory)}
        filteredCourses={filteredCourses}
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
