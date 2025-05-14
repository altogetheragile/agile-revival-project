
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Course, CourseFormData } from "@/types/course";
import { CourseCategory } from "@/components/courses/CourseCategoryTabs";
import TrainingHeader from "@/components/courses/TrainingHeader";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseScheduleView from "@/components/courses/CourseScheduleView";
import CustomTrainingCTA from "@/components/courses/CustomTrainingCTA";
import CourseFormDialog from "@/components/courses/CourseFormDialog";
import { DeleteConfirmationDialog } from "@/components/admin/users/DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useOptimisticCourses } from "@/hooks/useOptimisticCourses";

const TrainingSchedule = () => {
  // Updated to use string type for CourseCategory
  const [selectedTab, setSelectedTab] = useState<CourseCategory>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  
  // Replace the previous course state and loading state with our optimistic hook
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
  
  // Simplified admin check - always true for demo purposes
  const isAdmin = true;

  useEffect(() => {
    // Set up periodic background refresh at a reduced frequency (30 seconds)
    const intervalId = setInterval(() => {
      refreshCoursesInBackground();
    }, 30000); // Reduced from 10000 (10s) to 30000 (30s)
    
    return () => clearInterval(intervalId);
  }, [refreshCoursesInBackground]);

  const filteredCourses = selectedTab === "all" 
    ? courses 
    : courses.filter(course => course.category === selectedTab);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="section-container">
          <TrainingHeader />
          
          <div className="flex justify-end mb-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="text-gray-600 border-gray-300 hover:bg-gray-50 flex items-center"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleForceReset}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset & Reload
            </Button>
          </div>
          
          <CourseFilters
            selectedTab={selectedTab}
            onTabChange={(value) => setSelectedTab(value as CourseCategory)}
            filteredCourses={filteredCourses}
          />
          
          {isInitialLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading courses...</p>
            </div>
          ) : (
            <>
              {isRefreshing && (
                <div className="bg-blue-50 text-blue-700 text-xs py-1 px-2 rounded-md mb-2 flex items-center justify-center">
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" /> 
                  Refreshing data...
                </div>
              )}
              
              <CourseScheduleView 
                courses={filteredCourses} 
                isAdmin={isAdmin} // Always pass true to enable editing
                onEdit={handleEditCourse}
                onDelete={handleDeleteCourse}
              />
            </>
          )}
          
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

export default TrainingSchedule;
