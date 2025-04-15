
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Course } from "@/types/course";
import { getAllCourses } from "@/services/courseService";
import { CourseCategory } from "@/components/courses/CourseCategoryTabs";
import TrainingHeader from "@/components/courses/TrainingHeader";
import CourseFilters from "@/components/courses/CourseFilters";
import CourseScheduleView from "@/components/courses/CourseScheduleView";
import CustomTrainingCTA from "@/components/courses/CustomTrainingCTA";

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
          <TrainingHeader />
          
          <CourseFilters
            selectedTab={selectedTab}
            onTabChange={(value) => setSelectedTab(value as CourseCategory)}
            filteredCourses={filteredCourses}
          />
          
          <CourseScheduleView courses={filteredCourses} />
          
          <CustomTrainingCTA />
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default TrainingSchedule;
