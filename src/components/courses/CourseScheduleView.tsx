
import React from "react";
import { Course } from "@/types/course";
import CourseList from "./CourseList";
import CourseGrid from "./CourseGrid";
import { useMobile } from "@/hooks/use-mobile";

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
  const isMobile = useMobile();

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-600">No courses available in this category.</h3>
        <p className="text-gray-500 mt-2">Please check back later or try another category.</p>
      </div>
    );
  }

  return isMobile ? (
    <CourseList 
      courses={courses} 
      isMobile={true}
      onEdit={isAdmin ? onEdit : undefined}
      onDelete={isAdmin ? onDelete : undefined}
    />
  ) : (
    <CourseGrid courses={courses} />
  );
};

export default CourseScheduleView;
