
import { Course } from "@/types/course";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Users, Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onViewRegistrations: (course: Course) => void;
  onScheduleCourse: (template: Course) => void;
  onPreviewTemplate?: (template: Course) => void;
}

export const CourseTable = ({ 
  courses, 
  onEdit, 
  onDelete, 
  onViewRegistrations,
  onScheduleCourse,
  onPreviewTemplate
}: CourseTableProps) => {
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
    if (status === 'published') {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Published</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-50 text-gray-600">Draft</Badge>;
  };

  if (!courses.length) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No course templates found. Add your first template to get started.
      </Card>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map(course => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>{course.category}</TableCell>
              <TableCell>{getFormatBadge(course.format)}</TableCell>
              <TableCell>{getStatusBadge(course.status)}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  onClick={() => onEdit(course)}
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                {onPreviewTemplate && (
                  <Button
                    onClick={() => onPreviewTemplate(course)}
                    size="sm"
                    variant="outline"
                    className="h-8 px-2 text-purple-600"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                )}
                
                <Button
                  onClick={() => onScheduleCourse(course)}
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-green-600"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
                <Button
                  onClick={() => onDelete(course)}
                  size="sm"
                  variant="outline"
                  className="h-8 px-2 text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
