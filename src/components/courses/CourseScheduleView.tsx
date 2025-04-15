
import React from 'react';
import { Course } from '@/types/course';
import { Separator } from '@/components/ui/separator';
import CourseTable from './CourseTable';
import CourseGrid from './CourseGrid';

interface CourseScheduleViewProps {
  courses: Course[];
}

const CourseScheduleView = ({ courses }: CourseScheduleViewProps) => {
  return (
    <>
      <Separator className="my-12" />
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-agile-purple-dark mb-6">Course Schedule At-a-Glance</h2>
        <CourseTable courses={courses} />
        
        <h3 className="text-xl font-bold text-agile-purple-dark mt-12 mb-6">Upcoming Courses</h3>
        <CourseGrid courses={courses} />
      </div>
    </>
  );
};

export default CourseScheduleView;
