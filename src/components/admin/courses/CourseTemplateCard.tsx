
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, Copy } from "lucide-react";
import { CourseTemplate } from "@/types/course";
import { Badge } from "@/components/ui/badge";

interface CourseTemplateCardProps {
  template: CourseTemplate;
  onEdit: (template: CourseTemplate) => void;
  onDelete: (templateId: string) => void;
  onSchedule: (template: CourseTemplate) => void;
  onDuplicate: (template: CourseTemplate) => void;
}

export const CourseTemplateCard: React.FC<CourseTemplateCardProps> = ({
  template,
  onEdit,
  onDelete,
  onSchedule,
  onDuplicate
}) => {
  const eventTypeLabel = template.eventType || "Course";
  const categoryLabel = template.category || "General";
  
  return (
    <Card className="overflow-hidden border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{template.title}</h3>
              <Badge variant="outline" className="capitalize">{eventTypeLabel}</Badge>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {template.description && template.description.length > 100
                ? `${template.description.substring(0, 100)}...`
                : template.description}
            </div>
            
            <div className="flex items-center gap-2 text-xs mt-2">
              <Badge variant="secondary" className="font-normal">{categoryLabel}</Badge>
              {template.format && (
                <Badge variant="secondary" className="font-normal capitalize">{template.format}</Badge>
              )}
              {template.skillLevel && (
                <Badge variant="secondary" className="font-normal capitalize">{template.skillLevel}</Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(template)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onDuplicate(template)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                className="bg-rose-100 hover:bg-rose-200 text-rose-600 hover:text-rose-700" 
                onClick={() => onDelete(template.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              size="sm" 
              variant="default" 
              className="mt-1" 
              onClick={() => onSchedule(template)}
            >
              <Calendar className="h-4 w-4 mr-1" /> Schedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
