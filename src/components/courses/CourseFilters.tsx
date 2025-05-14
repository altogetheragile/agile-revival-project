
import React from 'react';
import { Course } from '@/types/course';
import { CourseCategory } from './CourseCategoryTabs';
import CourseCategoryFilter from './CourseCategoryFilter';

interface CourseFiltersProps {
  selectedTab: CourseCategory;
  onTabChange: (value: string) => void;
  filteredCourses: Course[];
}

const CourseFilters = ({ selectedTab, onTabChange, filteredCourses }: CourseFiltersProps) => {
  const handleCategoryChange = (value: string) => {
    console.log("CourseFilters: Category change requested to", value);
    onTabChange(value);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <CourseCategoryFilter
        selectedCategory={selectedTab}
        onCategoryChange={handleCategoryChange}
        courses={filteredCourses}
      />
    </div>
  );
};

export default CourseFilters;
