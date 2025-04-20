
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course } from "@/types/course";
import { COURSE_CATEGORIES } from "@/constants/courseCategories";

export type CourseCategory = "all" | "scrum" | "kanban" | "leadership";

interface CourseCategoryTabsProps {
  selectedTab: CourseCategory;
  onTabChange: (value: string) => void;
  filteredCourses: Course[];
}

const CourseCategoryTabs = ({ 
  selectedTab, 
  onTabChange, 
  filteredCourses 
}: CourseCategoryTabsProps) => {
  // Use centralized categories (including "all")
  return (
    <Tabs 
      value={selectedTab} 
      onValueChange={onTabChange} 
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-4">
        {COURSE_CATEGORIES.map((category) => (
          <TabsTrigger 
            key={category.value} 
            value={category.value}
          >
            {category.label} ({category.value === "all" 
              ? filteredCourses.length 
              : filteredCourses.filter(c => c.category === category.value).length})
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default CourseCategoryTabs;
