
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Course } from "@/types/course";
import { CourseTemplateCard } from "./CourseTemplateCard";
import { CourseTemplateFormDialog } from "./CourseTemplateFormDialog";
import { ScheduleCourseFromTemplateDialog } from "./ScheduleCourseFromTemplateDialog";
import { EmptyTemplateState } from "./templates/EmptyTemplateState";
import { TemplateLoadingState } from "./templates/TemplateLoadingState";
import { useCourseTemplateManagement } from "@/hooks/useCourseTemplateManagement";

export const CourseTemplatesSettings = () => {
  const {
    templates,
    isLoading,
    isFormOpen,
    setIsFormOpen,
    currentTemplate,
    isScheduleDialogOpen,
    setIsScheduleDialogOpen,
    handleAddTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleScheduleCourse,
    handleFormSubmit,
    loadTemplates
  } = useCourseTemplateManagement();

  useEffect(() => {
    loadTemplates();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Templates</CardTitle>
        <CardDescription>
          Manage your course templates and schedule course instances
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TemplateLoadingState />
        ) : templates.length === 0 ? (
          <EmptyTemplateState />
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {templates.map((template) => (
                <CourseTemplateCard
                  key={template.id}
                  template={template}
                  onEdit={handleEditTemplate}
                  onDelete={handleDeleteTemplate}
                  onSchedule={handleScheduleCourse}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddTemplate}>
          <Plus className="h-4 w-4 mr-1" /> Add Template
        </Button>
      </CardFooter>

      <CourseTemplateFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentTemplate={currentTemplate}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
      />

      <ScheduleCourseFromTemplateDialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
        template={currentTemplate}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsScheduleDialogOpen(false)}
      />
    </Card>
  );
};
