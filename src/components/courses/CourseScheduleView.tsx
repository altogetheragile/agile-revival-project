
import React from "react";
import { Course } from "@/types/course";
import CourseList from "./CourseList";
import CourseGrid from "./CourseGrid";
import { useIsMobile } from "@/hooks/use-mobile";

interface CourseScheduleViewProps {
  courses: Course[];
  isAdmin?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

const CourseScheduleView: React.FC<CourseScheduleViewProps> = ({ 
  courses,
  isAdmin,
  onEdit,
  onDelete
}) => {
  const isMobile = useIsMobile();

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">No courses available in this category.</h3>
        <p className="text-gray-500 mt-2">Please check back later or try another category.</p>
      </div>
    );
  }

  // Mark each course with a visible property for admins to indicate if it's a draft
  const enhancedCourses = courses.map(course => ({
    ...course,
    // Add an isDraft flag that can be used in the UI
    isDraft: course.status === 'draft'
  }));

  return isMobile ? (
    <CourseList 
      courses={enhancedCourses} 
      isMobile={true}
      onEdit={isAdmin ? onEdit : undefined}
      onDelete={isAdmin ? onDelete : undefined}
    />
  ) : (
    <CourseGrid 
      courses={enhancedCourses}
      onEdit={isAdmin ? onEdit : undefined}
      onDelete={isAdmin ? onDelete : undefined}
    />
  );
};

export default CourseScheduleView;
