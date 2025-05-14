
import React from 'react';
import { Course } from '@/types/course';
import { CourseCategory } from './CourseCategoryTabs';
import CourseCategoryTabs from './CourseCategoryTabs';

interface CourseFiltersProps {
  selectedTab: CourseCategory;
  onTabChange: (value: string) => void;
  filteredCourses: Course[];
}

const CourseFilters = ({ selectedTab, onTabChange, filteredCourses }: CourseFiltersProps) => {
  const handleTabChange = (value: string) => {
    console.log("CourseFilters: Tab change requested to", value);
    onTabChange(value);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <CourseCategoryTabs
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        filteredCourses={filteredCourses}
      />
    </div>
  );
};

export default CourseFilters;
