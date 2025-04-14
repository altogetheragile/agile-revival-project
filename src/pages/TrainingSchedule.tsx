
import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Bookmark, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CourseForm from "@/components/courses/CourseForm";
import { Course, CourseFormData } from "@/types/course";
import { 
  getAllCourses, 
  getCoursesByCategory, 
  createCourse, 
  updateCourse, 
  deleteCourse 
} from "@/services/courseService";

type CourseCategory = "scrum" | "kanban" | "leadership" | "all";

const CourseCard = ({ 
  course, 
  onEdit, 
  onDelete 
}: { 
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="relative">
        <CardTitle className="text-agile-purple-dark">{course.title}</CardTitle>
        <CardDescription className="font-medium flex items-center gap-2">
          <Calendar className="h-4 w-4" /> {course.dates}
        </CardDescription>
        
        {onEdit && onDelete && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(course)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(course)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-agile-purple" />
            <span>{course.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-agile-purple" />
            <span>Instructor: {course.instructor}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-agile-purple" />
            <span>{course.spotsAvailable} spots available</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:items-center">
        <div className="font-bold text-lg">{course.price}</div>
        <Button className="w-full sm:w-auto">
          <Bookmark className="mr-2 h-4 w-4" /> Reserve Spot
        </Button>
      </CardFooter>
    </Card>
  );
};

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
            <Tabs 
              defaultValue="all" 
              className="w-full max-w-6xl mx-auto" 
              onValueChange={(value) => setSelectedTab(value as CourseCategory)}
            >
              <div className="flex justify-between items-center">
                <TabsList className="grid grid-cols-4 w-full max-w-md">
                  <TabsTrigger value="all">All Courses</TabsTrigger>
                  <TabsTrigger value="scrum">Scrum</TabsTrigger>
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="leadership">Leadership</TabsTrigger>
                </TabsList>
                <Button onClick={handleAddCourse}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Course
                </Button>
              </div>

              <TabsContent value="all" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onEdit={handleEditCourse} 
                      onDelete={handleDeleteCourse} 
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="scrum" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onEdit={handleEditCourse} 
                      onDelete={handleDeleteCourse} 
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="kanban" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onEdit={handleEditCourse} 
                      onDelete={handleDeleteCourse} 
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="leadership" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onEdit={handleEditCourse} 
                      onDelete={handleDeleteCourse} 
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Separator className="my-12" />

          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-agile-purple-dark mb-6">Course Schedule At-a-Glance</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>{course.dates}</TableCell>
                      <TableCell>{course.location}</TableCell>
                      <TableCell className="text-right">{course.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentCourse ? `Edit Course: ${currentCourse.title}` : "Add New Course"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {currentCourse ? "update" : "create"} a course.
            </DialogDescription>
          </DialogHeader>
          <CourseForm 
            initialData={currentCourse || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default TrainingSchedule;
