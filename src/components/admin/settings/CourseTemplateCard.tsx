
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { CourseTemplate } from "@/types/course";

interface CourseTemplateCardProps {
  template: CourseTemplate;
  onEdit: (template: CourseTemplate) => void;
  onDelete: (id: string) => void;
  onSchedule: (template: CourseTemplate) => void;
}

export const CourseTemplateCard: React.FC<CourseTemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  onSchedule,
}) => {
  return (
    <Card className="border border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{template.title}</CardTitle>
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
          Schedule Course
        </Button>
      </CardFooter>
    </Card>
  );
};

