
import React from "react";
import { Course } from "@/types/course";
import CourseCard from "./CourseCard";

interface CourseListProps {
  courses: Course[];
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard 
          key={course.id} 
          course={course} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default CourseList;
