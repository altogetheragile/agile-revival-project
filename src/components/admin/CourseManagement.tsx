
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Course, CourseFormData } from "@/types/course";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "@/services/courseService";
import { CourseManagementHeader } from "./courses/CourseManagementHeader";
import { CourseTable } from "./courses/CourseTable";
import CourseFormDialog from "@/components/courses/CourseFormDialog";
import { DeleteConfirmationDialog } from "./users/DeleteConfirmationDialog";

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>(getAllCourses());
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Filter courses based on search term
  const filteredCourses = courses.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.category.toLowerCase().includes(searchLower) ||
      course.instructor.toLowerCase().includes(searchLower)
    );
  });

  const handleAddCourse = () => {
    setCurrentCourse(null);
    setIsFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (course: Course) => {
    setDeleteCourseId(course.id);
    setIsConfirmDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteCourseId) {
      if (deleteCourse(deleteCourseId)) {
        setCourses(getAllCourses());
        toast({
          title: "Course deleted",
          description: "The course has been removed successfully."
        });
      }
      setIsConfirmDialogOpen(false);
      setDeleteCourseId(null);
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

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <CourseManagementHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddCourse}
      />
      
      <CourseTable 
        courses={filteredCourses} 
        onEdit={handleEditCourse} 
        onDelete={handleDeleteConfirm}
      />
      
      <CourseFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentCourse={currentCourse}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
      />

      <DeleteConfirmationDialog 
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CourseManagement;
