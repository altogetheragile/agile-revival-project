
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Course, CourseFormData } from "@/types/course";
import { getScheduledCourses, updateCourse, deleteCourse } from "@/services/courseService";
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
import { toast } from "sonner";

const TrainingSchedule = () => {
  // Updated to use string type for CourseCategory
  const [selectedTab, setSelectedTab] = useState<CourseCategory>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  
  // Simplified admin check - always true for demo purposes
  const isAdmin = true;

  useEffect(() => {
    refreshCourses();
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      refreshCourses();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const refreshCourses = async () => {
    try {
      setIsLoading(true);
      const scheduledCourses = await getScheduledCourses();
      setCourses(scheduledCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      const updated = await updateCourse(currentCourse.id, data);
      if (updated) {
        await refreshCourses();
        uiToast({
          title: "Course updated",
          description: `"${data.title}" has been updated successfully.`
        });
      }
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
        const success = await deleteCourse(deleteCourseId);
        if (success) {
          await refreshCourses();
          uiToast({
            title: "Course deleted",
            description: "The course has been removed successfully."
          });
        }
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
  
  const handleManualRefresh = async () => {
    await refreshCourses();
    toast.success("Refreshed", {
      description: "Course data has been refreshed from the database."
    });
  };
  
  // Add a reset function to force a global cache reset and page reload
  const handleForceReset = () => {
    toast.success("Cache reset", {
      description: "The page will reload to refresh data."
    });
    
    // Force reload the current page
    window.location.reload();
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
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
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
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading courses...</p>
            </div>
          ) : (
            <CourseScheduleView 
              courses={filteredCourses} 
              isAdmin={isAdmin} // Always pass true to enable editing
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
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
