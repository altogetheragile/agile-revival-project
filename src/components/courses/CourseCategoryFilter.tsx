
import React from 'react';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course } from '@/types/course';
import { COURSE_CATEGORIES } from '@/constants/courseCategories';

interface CourseCategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  courses: Course[];
}

const CourseCategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  courses 
}: CourseCategoryFilterProps) => {
  const handleValueChange = (value: string) => {
    console.log("CourseCategoryFilter: Category changed to", value);
    onCategoryChange(value);
  };

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-gray-500" />
      <Select value={selectedCategory} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px] md:w-[220px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {COURSE_CATEGORIES.map((category) => {
              // Compare categories case-insensitively to handle inconsistent DB capitalization
              const count = category.value.toLowerCase() === "all" 
                ? courses.length 
                : courses.filter(c => c.category.toLowerCase() === category.value.toLowerCase()).length;
                
              return (
                <SelectItem key={category.value} value={category.value}>
                  {category.label} ({count})
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CourseCategoryFilter;
