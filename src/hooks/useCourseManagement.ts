
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Course, CourseFormData, CourseMaterial } from "@/types/course";
import { getAllCourses, createCourse, updateCourse, deleteCourse, addCourseMaterial } from "@/services/courseService";
import { supabase } from "@/integrations/supabase/client";

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>(getAllCourses());
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(false);
  const { toast } = useToast();

  const filteredCourses = courses.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.category.toLowerCase().includes(searchLower) ||
      course.instructor.toLowerCase().includes(searchLower)
    );
  });

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      // Handle Google Drive folder information
      const googleDriveData = {
        googleDriveFolderId: data.googleDriveFolderId,
        googleDriveFolderUrl: data.googleDriveFolderUrl
      };
      
      if (currentCourse) {
        const updated = updateCourse(currentCourse.id, {
          ...data,
          ...googleDriveData
        });
        
        if (updated) {
          setCourses(getAllCourses());
          setCurrentCourse(updated); // Update the current course to reflect changes
          toast({
            title: "Course updated",
            description: `"${data.title}" has been updated successfully.`
          });
        }
      } else {
        const created = createCourse({
          ...data,
          ...googleDriveData
        });
        
        setCourses(getAllCourses());
        setCurrentCourse(created); // Set the new course as the current course
        toast({
          title: "Course created",
          description: `"${created.title}" has been ${data.status === 'published' ? 'published' : 'saved as draft'}.`
        });
      }
      // We no longer auto-close the form dialog
      // setIsFormOpen(false);
    } catch (error) {
      console.error("Error handling course submission:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the course.",
        variant: "destructive"
      });
    }
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

  return {
    courses: filteredCourses,
    searchTerm,
    setSearchTerm,
    isFormOpen,
    setIsFormOpen,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    currentCourse,
    setCurrentCourse,
    deleteCourseId,
    setDeleteCourseId,
    viewingRegistrations,
    setViewingRegistrations,
    handleFormSubmit,
    handleDelete
  };
};
