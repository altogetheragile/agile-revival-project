
import React, { useState, useEffect, useCallback } from "react";
import { Course } from "@/types/course";
import { CourseCategory } from "@/components/courses/CourseCategoryTabs";
import { getScheduledCourses, deleteCourse } from "@/services/courseService";
import CourseDisplay from "./CourseDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

const TrainingScheduleContainer = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isAdmin } = useAuth();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCourses = useCallback(async () => {
    try {
      console.log("Fetching courses...");
      const scheduledCourses = await getScheduledCourses();
      console.log("Fetched courses:", scheduledCourses);
      setCourses(scheduledCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleCategoryChange = (category: CourseCategory) => {
    console.log("TrainingScheduleContainer: Setting category to", category);
    setSelectedCategory(category);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCourses();
  };

  const handleEditCourse = (course: Course) => {
    // This would be implemented if edit functionality is needed
    console.log("Edit course:", course);
  };

  const handleDeleteCourse = (course: Course) => {
    if (!isAdmin) {
      toast.error("Unauthorized", { description: "Only administrators can delete courses" });
      return;
    }
    setCourseToDelete(course);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete || !isAdmin) return;
    
    try {
      setIsDeleting(true);
      const success = await deleteCourse(courseToDelete.id);
      
      if (success) {
        toast.success("Course deleted", { 
          description: `${courseToDelete.title} has been removed` 
        });
        // Update the local state to remove the deleted course
        setCourses(prevCourses => 
          prevCourses.filter(course => course.id !== courseToDelete.id)
        );
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Delete failed", { 
        description: "There was a problem deleting the course. Please try again." 
      });
    } finally {
      setIsDeleting(false);
      setCourseToDelete(null);
      setConfirmDeleteOpen(false);
    }
  };

  const cancelDelete = () => {
    setCourseToDelete(null);
    setConfirmDeleteOpen(false);
  };

  return (
    <>
      <CourseDisplay
        courses={courses}
        selectedTab={selectedCategory}
        onTabChange={handleCategoryChange}
        isInitialLoading={isLoading}
        isRefreshing={isRefreshing}
        isAdmin={isAdmin}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />
      
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {courseToDelete?.title}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TrainingScheduleContainer;
