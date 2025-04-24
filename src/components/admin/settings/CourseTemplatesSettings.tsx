
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Course, CourseFormData } from "@/types/course";
import { createCourse, updateCourse, deleteCourse, getCourseTemplates } from "@/services/courseService";

// New components
import { CourseTemplateCard } from "./CourseTemplateCard";
import { CourseTemplateFormDialog } from "./CourseTemplateFormDialog";
import { ScheduleCourseFromTemplateDialog } from "./ScheduleCourseFromTemplateDialog";

export const CourseTemplatesSettings = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Course[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Course | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const courseTemplates = await getCourseTemplates();
      setTemplates(courseTemplates);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast({
        title: "Error",
        description: "There was a problem loading the course templates.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleAddTemplate = () => {
    setCurrentTemplate(null);
    setIsFormOpen(true);
  };

  const handleEditTemplate = (template: Course) => {
    setCurrentTemplate(template);
    setIsFormOpen(true);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const success = await deleteCourse(templateId);
      if (success) {
        await loadTemplates();
        toast({
          title: "Template deleted",
          description: "The course template has been removed successfully."
        });
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting the course template.",
        variant: "destructive"
      });
    }
  };

  const handleScheduleCourse = (template: Course) => {
    setCurrentTemplate(template);
    setIsScheduleDialogOpen(true);
  };

  const handleFormSubmit = async (data: CourseFormData) => {
    try {
      // Ensure required fields have default values
      const templateData: CourseFormData = {
        ...data,
        isTemplate: true,
        // Add defaults for required fields in the database
        dates: data.dates || "Template - No Dates",
        location: data.location || "To Be Determined",
        instructor: data.instructor || "To Be Assigned",
        spotsAvailable: data.spotsAvailable || 0,
      };

      if (currentTemplate) {
        const updated = await updateCourse(currentTemplate.id, templateData);
        if (updated) {
          await loadTemplates();
          setIsFormOpen(false);
          toast({
            title: "Template updated",
            description: `"${data.title}" has been updated successfully.`
          });
        }
      } else {
        const created = await createCourse(templateData);
        if (created) {
          await loadTemplates();
          setIsFormOpen(false);
          toast({
            title: "Template created",
            description: `"${data.title}" has been created successfully.`
          });
        }
      }
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
      
      const scheduled = await createCourse(courseData);
      
      if (scheduled) {
        setIsScheduleDialogOpen(false);
        toast({
          title: "Course scheduled",
          description: `"${data.title}" has been scheduled successfully.`
        });
      }
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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
          </div>
        ) : templates.length === 0 ? (
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
