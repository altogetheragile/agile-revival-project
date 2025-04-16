
import { Course } from "@/types/course";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Users } from "lucide-react";

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onViewRegistrations: (course: Course) => void;
}

export const CourseTable = ({ courses, onEdit, onDelete, onViewRegistrations }: CourseTableProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Spots</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell className="capitalize">{course.category}</TableCell>
                  <TableCell>{course.dates}</TableCell>
                  <TableCell>{course.price}</TableCell>
                  <TableCell>{course.spotsAvailable}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onViewRegistrations(course)}
                        title="View Registrations"
                      >
                        <Users size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(course)}
                        title="Edit Course"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive" 
                        onClick={() => onDelete(course)}
                        title="Delete Course"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No courses found. Click "Add New Course" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
