
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Course } from "@/types/course";
import { getAllCourses } from "@/services/courseService";
import CourseCategoryTabs, { CourseCategory } from "@/components/courses/CourseCategoryTabs";
import CourseTable from "@/components/courses/CourseTable";

const TrainingSchedule = () => {
  const [selectedTab, setSelectedTab] = useState<CourseCategory>("all");
  const [courses] = useState<Course[]>(getAllCourses());

  const filteredCourses = selectedTab === "all" 
    ? courses 
    : courses.filter(course => course.category === selectedTab);

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

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default TrainingSchedule;
