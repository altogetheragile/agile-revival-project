
import React, { memo } from "react";
import { Course } from "@/types/course";
import CourseCard from "./CourseCard";

interface CourseListProps {
  courses: Course[];
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  isMobile?: boolean;
}

// Using React.memo to prevent unnecessary re-renders
const CourseList: React.FC<CourseListProps> = memo(({ courses, onEdit, onDelete, isMobile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          isMobile={isMobile}
        />
      ))}
    </div>
  );
});

CourseList.displayName = "CourseList";

export default CourseList;
