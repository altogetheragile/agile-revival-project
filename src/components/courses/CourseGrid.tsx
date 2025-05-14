
import React, { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Course } from "@/types/course";
import CourseGridItem from "./grid/CourseGridItem";
import SideBySideLayout from "./grid/SideBySideLayout";
import ImageLeftLayout from "./grid/ImageLeftLayout";
import CourseImage from "./grid/CourseImage";
import RegistrationDialog from "./RegistrationDialog";

interface CourseGridProps {
  courses: Course[];
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

// Using React.memo to prevent unnecessary re-renders
const CourseGrid: React.FC<CourseGridProps> = memo(({ courses, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  
  // Convert price string to use £ symbol
  const formatPrice = (price: string) => {
    return price.replace(/\$/, '£');
  };

  // Handle Details button click to navigate to course details page
  const handleViewDetails = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };
  
  // Handle Reserve Spot button click
  const handleReserveClick = (course: Course) => {
    setSelectedCourse(course);
    setRegistrationOpen(true);
  };
  
  // Render image based on course settings
  const renderImage = (course: Course) => {
    return <CourseImage course={course} />;
  };
  
  // Render course card based on layout
  const renderCourseCard = (course: Course) => {
    const layout = course.imageLayout || "standard";
    
    if (layout === "side-by-side" && course.imageUrl) {
      return (
        <SideBySideLayout
          key={course.id}
          course={course}
          onView={handleViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onReserve={handleReserveClick}
          formatPrice={formatPrice}
          renderImage={renderImage}
        />
      );
    }
    
    if (layout === "image-left" && course.imageUrl) {
      return (
        <ImageLeftLayout
          key={course.id}
          course={course}
          onView={handleViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onReserve={handleReserveClick}
          formatPrice={formatPrice}
          renderImage={renderImage}
        />
      );
    }
    
    // Default layout (standard, image-top, full-width, etc.)
    return (
      <CourseGridItem
        key={course.id}
        course={course}
        onView={handleViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
        onReserve={handleReserveClick}
        formatPrice={formatPrice}
      />
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
        {courses.map((course) => renderCourseCard(course))}
      </div>
      
      <RegistrationDialog
        course={selectedCourse}
        open={registrationOpen}
        onOpenChange={setRegistrationOpen}
      />
    </>
  );
});

CourseGrid.displayName = "CourseGrid";

export default CourseGrid;
