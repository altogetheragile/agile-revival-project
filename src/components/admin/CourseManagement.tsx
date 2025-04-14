
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CourseList from "@/components/courses/CourseList";
import CourseFormDialog from "@/components/courses/CourseFormDialog";
import { Course, CourseFormData } from "@/types/course";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "@/services/courseService";
import { useToast } from "@/hooks/use-toast";

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>(getAllCourses());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const { toast } = useToast();
  
  const handleAddCourse = () => {
    setCurrentCourse(null);
    setIsFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setIsFormOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      if (deleteCourse(course.id)) {
        setCourses(getAllCourses());
        toast({
          title: "Course deleted",
          description: `"${course.title}" has been removed successfully.`
        });
      }
    }
  };

  const handleFormSubmit = (data: CourseFormData) => {
    if (currentCourse) {
      // Update existing course
      const updated = updateCourse(currentCourse.id, data);
      if (updated) {
        setCourses(getAllCourses());
        toast({
          title: "Course updated",
          description: `"${data.title}" has been updated successfully.`
        });
      }
    } else {
      // Create new course
      const created = createCourse(data);
      setCourses(getAllCourses());
      toast({
        title: "Course created",
        description: `"${created.title}" has been added successfully.`
      });
    }
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Course Management</h2>
        <Button onClick={handleAddCourse} className="flex items-center gap-2">
          <PlusCircle size={16} /> Add New Course
        </Button>
      </div>
      
      {courses.length > 0 ? (
        <CourseList 
          courses={courses} 
          onEdit={handleEditCourse} 
          onDelete={handleDeleteCourse}
          isMobile={true} // Always show edit/delete buttons inline for admin view
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          No courses found. Click "Add New Course" to create one.
        </div>
      )}
      
      <CourseFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentCourse={currentCourse}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    </div>
  );
};

export default CourseManagement;
