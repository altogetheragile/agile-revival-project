
import { Copy, Pencil, Trash } from "lucide-react";
import { Course } from "@/types/course";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CourseTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  onDuplicate: (course: Course) => void;
}

export const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No courses or events found.</p>
        <p className="text-sm text-muted-foreground mt-1">Get started by adding your first course or event.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {course.eventType || "Course"}
                </Badge>
              </TableCell>
              <TableCell>{course.category}</TableCell>
              <TableCell>{course.dates}</TableCell>
              <TableCell>{course.location}</TableCell>
              <TableCell>
                <Badge
                  variant={course.status === "published" ? "default" : "secondary"}
                >
                  {course.status === "published" ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(course)}
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDuplicate(course)}
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(course)}
                    title="Delete"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
