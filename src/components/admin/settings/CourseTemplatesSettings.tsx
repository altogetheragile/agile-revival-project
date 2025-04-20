
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Edit, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";
import CourseForm from "@/components/courses/CourseForm";
import { Course, CourseFormData, CourseTemplate } from "@/types/course";
import { createCourse } from "@/services/courseService";

export const CourseTemplatesSettings = () => {
  const { toast } = useToast();
  const { settings, updateSettings } = useSiteSettings();
  const [templates, setTemplates] = useState<CourseTemplate[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<CourseTemplate | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  
  useEffect(() => {
    // Load templates from site settings
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
        // Update existing template
        updatedTemplates = templates.map(t => 
          t.id === currentTemplate.id ? templateData : t
        );
      } else {
        // Add new template
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
      // Create a new course instance from the template
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
  
  // Convert template to course form data
  const templateToCourseFormData = (template: CourseTemplate): CourseFormData => {
    return {
      title: template.title,
      description: template.description,
      category: template.category,
      price: template.price,
      dates: "",  // Empty as this is specific to an instance
      location: "", // Empty as this is specific to an instance
      instructor: "", // Empty as this is specific to an instance
      spotsAvailable: 12, // Default value
      learningOutcomes: template.learningOutcomes,
      prerequisites: template.prerequisites,
      targetAudience: template.targetAudience,
      duration: template.duration,
      skillLevel: template.skillLevel,
      format: template.format,
      status: template.status,
      templateId: template.id,
      isTemplate: false
    };
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
                <Card key={template.id} className="border border-muted">
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
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleScheduleCourse(template)}
                    >
                      Schedule Course
                    </Button>
                  </CardFooter>
                </Card>
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
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {currentTemplate ? `Edit Template: ${currentTemplate.title}` : "Add New Course Template"}
            </DialogTitle>
            <DialogDescription>
              Define the course details that will be used as a template for scheduling course instances.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <CourseForm 
              initialData={currentTemplate ? templateToCourseFormData(currentTemplate) : {
                title: "",
                description: "",
                dates: "",
                location: "",
                instructor: "",
                price: "£",
                category: "scrum",
                spotsAvailable: 12,
                isTemplate: true,
                status: "draft"
              }}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Schedule Course Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Schedule Course: {currentTemplate?.title}
            </DialogTitle>
            <DialogDescription>
              Create a new course instance from this template by adding dates, location, and instructor details.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {currentTemplate && (
              <CourseForm 
                initialData={templateToCourseFormData(currentTemplate)}
                onSubmit={handleScheduleSubmit}
                onCancel={() => setIsScheduleDialogOpen(false)}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
