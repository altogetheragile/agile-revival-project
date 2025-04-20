
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";
import { Course, CourseFormData, CourseTemplate } from "@/types/course";
import { createCourse } from "@/services/courseService";

// New components
import { CourseTemplateCard } from "./CourseTemplateCard";
import { CourseTemplateFormDialog } from "./CourseTemplateFormDialog";
import { ScheduleCourseFromTemplateDialog } from "./ScheduleCourseFromTemplateDialog";

export const CourseTemplatesSettings = () => {
  const { toast } = useToast();
  const { settings, updateSettings } = useSiteSettings();
  const [templates, setTemplates] = useState<CourseTemplate[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<CourseTemplate | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  useEffect(() => {
    if (settings.courseTemplates) {
      setTemplates(settings.courseTemplates);
    } else {
      setTemplates([]);
    }
  }, [settings]);

  const handleAddTemplate = () => {
    setCurrentTemplate(null);
    setIsFormOpen(true);
  };

  const handleEditTemplate = (template: CourseTemplate) => {
    setCurrentTemplate(template);
    setIsFormOpen(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const updatedTemplates = templates.filter(t => t.id !== templateId);
      await updateSettings('courseTemplates', updatedTemplates);
      setTemplates(updatedTemplates);
      toast({
        title: "Template deleted",
        description: "The course template has been removed successfully."
      });
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting the course template.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleCourse = (template: CourseTemplate) => {
    setCurrentTemplate(template);
    setIsScheduleDialogOpen(true);
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      const templateData: CourseTemplate = {
        id: currentTemplate?.id || `tmp-${Date.now()}`,
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        learningOutcomes: Array.isArray(data.learningOutcomes) ? data.learningOutcomes : 
                        data.learningOutcomes ? [data.learningOutcomes] : [],
        prerequisites: data.prerequisites,
        targetAudience: data.targetAudience,
        duration: data.duration,
        skillLevel: data.skillLevel,
        format: data.format,
        status: data.status
      };

      let updatedTemplates: CourseTemplate[];
      if (currentTemplate) {
        updatedTemplates = templates.map(t =>
          t.id === currentTemplate.id ? templateData : t
        );
      } else {
        updatedTemplates = [...templates, templateData];
      }

      await updateSettings('courseTemplates', updatedTemplates);
      setTemplates(updatedTemplates);
      setIsFormOpen(false);

      toast({
        title: currentTemplate ? "Template updated" : "Template created",
        description: `"${data.title}" has been ${currentTemplate ? 'updated' : 'created'} successfully.`
      });
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the course template.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleSubmit = async (data: CourseFormData) => {
    try {
      const courseData: CourseFormData = {
        ...data,
        templateId: currentTemplate?.id,
        isTemplate: false
      };
      await createCourse(courseData);

      setIsScheduleDialogOpen(false);
      toast({
        title: "Course scheduled",
        description: `"${data.title}" has been scheduled successfully.`
      });
    } catch (error) {
      console.error("Error scheduling course:", error);
      toast({
        title: "Error",
        description: "There was a problem scheduling the course.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Templates</CardTitle>
        <CardDescription>
          Manage your course templates and schedule course instances
        </CardDescription>
      </CardHeader>
      <CardContent>
        {templates.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No templates found</AlertTitle>
            <AlertDescription>
              You haven't created any course templates yet. Add your first template to get started.
            </AlertDescription>
          </Alert>
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
      {/* Template Form Dialog */}
      <CourseTemplateFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentTemplate={currentTemplate}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
      />
      {/* Schedule Course Dialog */}
      <ScheduleCourseFromTemplateDialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
        template={currentTemplate}
        onSubmit={handleScheduleSubmit}
        onCancel={() => setIsScheduleDialogOpen(false)}
      />
    </Card>
  );
};

