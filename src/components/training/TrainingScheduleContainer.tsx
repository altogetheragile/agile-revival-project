
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Course, CourseFormData } from "@/types/course";
import { CourseCategory } from "@/components/courses/CourseCategoryTabs";
import TrainingHeader from "@/components/courses/TrainingHeader";
import CustomTrainingCTA from "@/components/courses/CustomTrainingCTA";
import CourseFormDialog from "@/components/courses/CourseFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/users/DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { useOptimisticCourses } from "@/hooks/useOptimisticCourses";
import CourseDisplay from "@/components/training/CourseDisplay";
import { useAuth } from "@/contexts/AuthContext";

const TrainingScheduleContainer = () => {
  // Updated to use string type for CourseCategory
  const [selectedTab, setSelectedTab] = useState<CourseCategory>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  const { isAdmin } = useAuth();
  
  // Use optimistic hook for course data management
  const {
    courses,
    isInitialLoading,
    isRefreshing,
    loadError,
    refreshCoursesInBackground,
    optimisticUpdateCourse,
    optimisticDeleteCourse,
    handleManualRefresh,
    handleForceReset
  } = useOptimisticCourses();

  useEffect(() => {
    // Set up periodic background refresh at a reduced frequency (30 seconds)
    const intervalId = setInterval(() => {
      if (isAdmin) {
        refreshCoursesInBackground();
      }
    }, 30000); // Reduced from 10000 (10s) to 30000 (30s)
    
    return () => clearInterval(intervalId);
  }, [refreshCoursesInBackground, isAdmin]);

  const handleTabChange = (value: CourseCategory) => {
    console.log("TrainingScheduleContainer: Changing tab to", value);
    setSelectedTab(value);
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setIsFormOpen(true);
  };

  const handleDeleteCourse = (course: Course) => {
    setDeleteCourseId(course.id);
    setIsConfirmDialogOpen(true);
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    if (!currentCourse) return;

    try {
      // Use optimistic update instead of waiting for the API call
      await optimisticUpdateCourse(currentCourse.id, data);
      setIsFormOpen(false);
      setCurrentCourse(null);
    } catch (error) {
      console.error("Error updating course:", error);
      uiToast({
        title: "Error",
        description: "There was a problem updating the course.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (deleteCourseId) {
      try {
        // Use optimistic delete instead of waiting for the API call
        await optimisticDeleteCourse(deleteCourseId);
      } catch (error) {
        console.error("Error deleting course:", error);
        uiToast({
          title: "Error",
          description: "There was a problem deleting the course.",
          variant: "destructive"
        });
      } finally {
        setIsConfirmDialogOpen(false);
        setDeleteCourseId(null);
      }
    }
  };

  useEffect(() => {
    // Log initial state for debugging
    console.log("TrainingScheduleContainer: Initial selectedTab", selectedTab);
    console.log("TrainingScheduleContainer: Courses count", courses.length);
  }, [selectedTab, courses]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="section-container">
          <TrainingHeader />
          
          <CourseDisplay
            courses={courses}
            selectedTab={selectedTab}
            onTabChange={handleTabChange}
            isInitialLoading={isInitialLoading}
            isRefreshing={isRefreshing}
            isAdmin={!!isAdmin}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
          
          <CustomTrainingCTA />

          <CourseFormDialog
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            currentCourse={currentCourse}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setCurrentCourse(null);
            }}
          />

          <DeleteConfirmationDialog 
            open={isConfirmDialogOpen}
            onOpenChange={setIsConfirmDialogOpen}
            onConfirm={handleDelete}
          />
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default TrainingScheduleContainer;
