
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar } from "lucide-react";
import { Course, CourseTemplate } from "@/types/course";
import { Badge } from "@/components/ui/badge";

interface CourseTemplateCardProps {
  template: CourseTemplate;
  onEdit: (template: CourseTemplate) => void;
  onDelete: (id: string) => void;
  onSchedule: (template: CourseTemplate) => void;
}

// Function to get appropriate event type badge color
const getEventTypeColor = (eventType: string | undefined): string => {
  switch (eventType?.toLowerCase()) {
    case "course":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "workshop":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "webinar":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    case "conference":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const CourseTemplateCard: React.FC<CourseTemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  onSchedule,
}) => {
  return (
    <Card className="border border-muted">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{template.title}</CardTitle>
          <Badge variant="outline" className={getEventTypeColor(template.eventType)}>
            {template.eventType || "Course"}
          </Badge>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {template.category} · {template.duration || "Duration not specified"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm truncate">{template.description}</p>
        <p className="text-sm font-medium mt-2">{template.price}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(template)}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(template.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
        <Button
          size="sm"
          onClick={() => onSchedule(template)}
        >
          <Calendar className="h-4 w-4 mr-1" /> Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};
