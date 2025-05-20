
import React from "react";
import { Course } from "@/types/course";
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
            template={template}
            onEdit={onEdit}
            onDelete={() => onDelete(template.id)}
            onSchedule={onSchedule}
            onDuplicate={() => onDuplicate(template)}
          />
        ))}
      </div>
    </div>
  );
};
