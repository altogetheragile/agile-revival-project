
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Course, CourseFormData } from "@/types/course";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "@/services/courseService";
import { forceGlobalReset } from "@/utils/courseStorage";

export const useCourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(false);
  const { toast } = useToast();

  // Load templates on mount and periodically refresh
  useEffect(() => {
    const loadCourses = () => {
      const allCourses = getAllCourses();
      // Filter to only show template courses in the management view
      const templateCourses = allCourses.filter(course => course.isTemplate === true);
      setCourses(templateCourses);
    };

    // Initial load
    loadCourses();
    
    // Refresh every 5 seconds
    const intervalId = setInterval(loadCourses, 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Reload courses when form or dialog state changes
  useEffect(() => {
    const allCourses = getAllCourses();
    const templateCourses = allCourses.filter(course => course.isTemplate === true);
    setCourses(templateCourses);
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
      // Always set isTemplate to true for courses managed here
      const templateData = {
        ...data,
        isTemplate: true
      };

      if (currentCourse) {
        const updated = updateCourse(currentCourse.id, templateData);
        if (updated) {
          const allCourses = getAllCourses();
          const templateCourses = allCourses.filter(course => course.isTemplate === true);
          setCourses(templateCourses);
          setCurrentCourse(updated);
          toast({
            title: "Template updated",
            description: `"${data.title}" has been updated successfully.`
          });
        }
      } else {
        const created = createCourse(templateData);
        const allCourses = getAllCourses();
        const templateCourses = allCourses.filter(course => course.isTemplate === true);
        setCourses(templateCourses);
        setCurrentCourse(created);
        toast({
          title: "Template created",
          description: `"${created.title}" has been created successfully.`
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
        const allCourses = getAllCourses();
        const templateCourses = allCourses.filter(course => course.isTemplate === true);
        setCourses(templateCourses);
        toast({
          title: "Template deleted",
          description: "The course template has been removed successfully."
        });
      }
      setIsConfirmDialogOpen(false);
      setDeleteCourseId(null);
    }
  };

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
