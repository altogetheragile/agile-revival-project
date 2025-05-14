
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Course } from "@/types/course";
import { COURSE_CATEGORIES } from "@/constants/courseCategories";

// Use string instead of string literal union type
export type CourseCategory = string;

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
  return (
    <Tabs 
      value={selectedTab} 
      onValueChange={onTabChange} 
      className="w-full"
    >
      <TabsList className="grid w-full md:grid-cols-4 grid-cols-2">
        {COURSE_CATEGORIES.map((category) => (
          <TabsTrigger 
            key={category.value} 
            value={category.value}
            className="whitespace-nowrap"
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
