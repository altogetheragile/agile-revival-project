
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Course, CourseFormData } from "@/types/course";
import { 
  getAllCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse 
} from "@/services/courseService";
import CourseCategoryTabs, { CourseCategory } from "@/components/courses/CourseCategoryTabs";
import CourseTable from "@/components/courses/CourseTable";
import CourseFormDialog from "@/components/courses/CourseFormDialog";

const TrainingSchedule = () => {
  const [selectedTab, setSelectedTab] = useState<CourseCategory>("all");
  const [courses, setCourses] = useState<Course[]>(getAllCourses());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  const filteredCourses = selectedTab === "all" 
    ? courses 
    : courses.filter(course => course.category === selectedTab);

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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <section className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-agile-purple-dark mb-4">Training Course Schedule</h1>
            <p className="text-xl text-gray-600">
              Browse our upcoming agile training courses and workshops led by expert coaches and instructors.
            </p>
          </div>

          <div className="flex justify-between items-center mb-8">
            <CourseCategoryTabs
              selectedTab={selectedTab}
              onTabChange={(value) => setSelectedTab(value as CourseCategory)}
              filteredCourses={filteredCourses}
              onAddCourse={handleAddCourse}
              onEditCourse={handleEditCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          </div>

          <Separator className="my-12" />

          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-agile-purple-dark mb-6">Course Schedule At-a-Glance</h2>
            <CourseTable courses={courses} />
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Need a custom training solution?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We offer tailored training programs for organizations of all sizes.
              Contact us to discuss your specific needs and goals.
            </p>
            <Button size="lg">
              Request Custom Training
            </Button>
          </div>
        </section>
      </main>

      <CourseFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentCourse={currentCourse}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default TrainingSchedule;
