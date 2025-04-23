
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Course, CourseFormData } from "@/types/course";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "@/services/courseService";
import { forceGlobalReset } from "@/utils/courseStorage";

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>(getAllCourses());
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(false);
  const { toast } = useToast();
  
  // Refresh timer to periodically update courses list
  useEffect(() => {
    // Initial load
    setCourses(getAllCourses());
    
    // Refresh every 5 seconds to ensure we have the latest data
    const intervalId = setInterval(() => {
      setCourses(getAllCourses());
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Refresh courses list when something changes
  useEffect(() => {
    setCourses(getAllCourses());
  }, [isFormOpen, isConfirmDialogOpen]);

  const filteredCourses = courses.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.category.toLowerCase().includes(searchLower) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchLower))
    );
  });

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      // Handle Google Drive folder information
      const googleDriveData = {
        googleDriveFolderId: data.googleDriveFolderId,
        googleDriveFolderUrl: data.googleDriveFolderUrl
      };

      // Set isTemplate to true for courses managed in Course Management
      const templateData = {
        ...data,
        isTemplate: true
      };
      
      if (currentCourse) {
        const updated = updateCourse(currentCourse.id, {
          ...templateData,
          ...googleDriveData
        });
        
        if (updated) {
          setCourses(getAllCourses());
          setCurrentCourse(updated); // Update the current course to reflect changes
          toast({
            title: "Template updated",
            description: `"${data.title}" has been updated successfully.`
          });
        }
      } else {
        const created = createCourse({
          ...templateData,
          ...googleDriveData
        });
        
        setCourses(getAllCourses());
        setCurrentCourse(created); // Set the new course as the current course
        toast({
          title: "Template created",
          description: `"${created.title}" has been ${data.status === 'published' ? 'published' : 'saved as draft'}.`
        });
      }
    } catch (error) {
      console.error("Error handling course submission:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the course template.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = () => {
    if (deleteCourseId) {
      if (deleteCourse(deleteCourseId)) {
        setCourses(getAllCourses());
        toast({
          title: "Template deleted",
          description: "The course template has been removed successfully."
        });
      }
      setIsConfirmDialogOpen(false);
      setDeleteCourseId(null);
    }
  };
  
  // Add a reset function to force a global cache reset
  const handleForceReset = () => {
    forceGlobalReset();
    toast({
      title: "Cache reset",
      description: "The course data cache has been reset. The page will reload."
    });
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
    handleDelete,
    handleForceReset
  };
};
