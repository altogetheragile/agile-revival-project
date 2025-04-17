
import { Course } from "@/types/course";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Users, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onViewRegistrations: (course: Course) => void;
}

export const CourseTable = ({ courses, onEdit, onDelete, onViewRegistrations }: CourseTableProps) => {
  const getFormatBadge = (format?: string) => {
    switch (format) {
      case 'online':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Online</Badge>;
      case 'live':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Live Virtual</Badge>;
      case 'hybrid':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Hybrid</Badge>;
      default:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In-Person</Badge>;
    }
  };

  const getStatusBadge = (status?: string) => {
    return status === 'published' ? 
      <Badge variant="default" className="bg-green-600">Published</Badge> :
      <Badge variant="outline" className="text-gray-600">Draft</Badge>;
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell>{getFormatBadge(course.format)}</TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
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
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
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
