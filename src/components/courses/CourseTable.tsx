
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Course } from "@/types/course";

interface CourseTableProps {
  courses: Course[];
}

const CourseTable: React.FC<CourseTableProps> = ({ courses }) => {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead className="hidden sm:table-cell">Dates</TableHead>
            <TableHead className="hidden sm:table-cell">Location</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">
                {course.title}
                <div className="block sm:hidden text-xs text-muted-foreground mt-1">
                  {course.dates} · {course.location}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{course.dates}</TableCell>
              <TableCell className="hidden sm:table-cell">{course.location}</TableCell>
              <TableCell className="text-right">{course.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
