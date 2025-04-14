
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
  return (
    <div className="flex justify-between items-center mb-8">
      <CourseCategoryTabs
        selectedTab={selectedTab}
        onTabChange={onTabChange}
        filteredCourses={filteredCourses}
      />
    </div>
  );
};

export default CourseFilters;
