
import React from "react";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import CourseList from "./CourseList";
import { useIsMobile } from "@/hooks/use-mobile";

export type CourseCategory = "scrum" | "kanban" | "leadership" | "all";

interface CourseCategoryTabsProps {
  selectedTab: CourseCategory;
  onTabChange: (value: string) => void;
  filteredCourses: Course[];
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (course: Course) => void;
}

const CourseCategoryTabs: React.FC<CourseCategoryTabsProps> = ({
  selectedTab,
  onTabChange,
  filteredCourses,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Tabs 
      defaultValue={selectedTab} 
      value={selectedTab}
      className="w-full max-w-6xl mx-auto" 
      onValueChange={onTabChange}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full sm:max-w-md">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="scrum">Scrum</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
        </TabsList>
        <Button onClick={onAddCourse}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      <TabsContent value="all" className="space-y-8 mt-6">
        <CourseList 
          courses={filteredCourses} 
          onEdit={onEditCourse} 
          onDelete={onDeleteCourse}
          isMobile={isMobile}
        />
      </TabsContent>

      <TabsContent value="scrum" className="space-y-8 mt-6">
        <CourseList 
          courses={filteredCourses} 
          onEdit={onEditCourse} 
          onDelete={onDeleteCourse} 
          isMobile={isMobile}
        />
      </TabsContent>

      <TabsContent value="kanban" className="space-y-8 mt-6">
        <CourseList 
          courses={filteredCourses} 
          onEdit={onEditCourse} 
          onDelete={onDeleteCourse} 
          isMobile={isMobile}
        />
      </TabsContent>

      <TabsContent value="leadership" className="space-y-8 mt-6">
        <CourseList 
          courses={filteredCourses} 
          onEdit={onEditCourse} 
          onDelete={onDeleteCourse} 
          isMobile={isMobile}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CourseCategoryTabs;
