
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
  console.log("CourseCategoryTabs rendering with selectedTab:", selectedTab);
  console.log("Available categories:", COURSE_CATEGORIES.map(c => c.value));
  
  return (
    <Tabs 
      value={selectedTab} 
      onValueChange={onTabChange} 
      className="w-full"
    >
      <TabsList className="grid w-full md:grid-cols-4 grid-cols-2">
        {COURSE_CATEGORIES.map((category) => {
          // Compare categories case-insensitively to handle inconsistent DB capitalization
          const count = category.value.toLowerCase() === "all" 
            ? filteredCourses.length 
            : filteredCourses.filter(c => c.category.toLowerCase() === category.value.toLowerCase()).length;
          
          return (
            <TabsTrigger 
              key={category.value} 
              value={category.value}
              className="whitespace-nowrap"
              onClick={() => {
                console.log("Tab clicked:", category.value);
                onTabChange(category.value);
              }}
            >
              {category.label} ({count})
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default CourseCategoryTabs;
