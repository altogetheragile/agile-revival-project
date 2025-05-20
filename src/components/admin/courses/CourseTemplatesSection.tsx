
import React from "react";
import { Course, CourseTemplate } from "@/types/course";
import { CourseTemplateCard } from "./CourseTemplateCard";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseTemplatesSectionProps {
  templates: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onSchedule: (course: Course) => void;
  onDuplicate: (course: Course) => void;
}

// Mapper function to convert Course to CourseTemplate
const toCourseTemplate = (course: Course): CourseTemplate => ({
  id: course.id,
  title: course.title,
  description: course.description,
  category: course.category || "General",
  eventType: course.eventType,
  format: course.format,
  skillLevel: course.skillLevel,
  price: course.price,
  learningOutcomes: course.learningOutcomes || [],
  prerequisites: course.prerequisites,
  targetAudience: course.targetAudience,
  duration: course.duration,
  imageUrl: course.imageUrl,
  imageAspectRatio: course.imageAspectRatio,
  imageSize: course.imageSize,
  imageLayout: course.imageLayout,
  spotsAvailable: course.spotsAvailable || 0,
  status: course.status,
  isTemplate: true
});

export const CourseTemplatesSection: React.FC<CourseTemplatesSectionProps> = ({
  templates,
  onEdit,
  onDelete,
  onSchedule,
  onDuplicate,
}) => {
  if (!templates || templates.length === 0) {
    return (
      <EmptyState
        icon={<Layout size={48} className="opacity-20" />}
        title="No Event Templates"
        description="Create your first event template to get started."
        action={
          <Button onClick={() => onEdit({ isTemplate: true } as Course)}>
            <Plus className="h-4 w-4 mr-1" />
            Create Template
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <CourseTemplateCard
            key={template.id}
            template={toCourseTemplate(template)}
            onEdit={() => onEdit(template)}
            onDelete={() => onDelete(template.id)}
            onSchedule={() => onSchedule(template)}
            onDuplicate={() => onDuplicate(template)}
          />
        ))}
      </div>
    </div>
  );
};
