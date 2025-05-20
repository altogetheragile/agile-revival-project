import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Course } from "@/types/course";
import { CourseTemplateCard } from "./CourseTemplateCard";
import { CourseTemplateFormDialog } from "./CourseTemplateFormDialog";
import { ScheduleCourseFromTemplateDialog } from "./ScheduleCourseFromTemplateDialog";
import { EmptyTemplateState } from "./templates/EmptyTemplateState";
import { TemplateLoadingState } from "./templates/TemplateLoadingState";
import { useCourseTemplates } from "@/hooks/useCourseTemplates"; 
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

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
    loadTemplates,
    isUpdating,
    templateSyncMode
  } = useCourseTemplates();

  const { user, isAdmin } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");

  // First, check authentication state
  useEffect(() => {
    const checkAuth = async () => {
      if (!user || !isAdmin) {
        setAuthChecked(true);
        return;
      }

      try {
        // Verify we have a valid session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setSessionError("Your session has expired. Please log in again.");
          toast.error("Session expired", {
            description: "Please log in again to manage templates"
          });
        } else {
          console.log("Valid session found for user:", session.user.id);
          setSessionError(null);
          // Now that we've confirmed auth is ready, load the templates
          loadTemplates();
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setSessionError("Error verifying your authentication status");
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, [user, isAdmin, loadTemplates]);

  const handleManualRefresh = async () => {
    if (!user || !isAdmin) {
      toast.error("Access denied", { 
        description: "You need admin privileges to refresh templates" 
      });
      return;
    }
    
    try {
      // Re-check session first
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setSessionError("Your session has expired. Please log in again.");
        toast.error("Session expired", {
          description: "Please log in again to manage templates"
        });
        return;
      }
      
      // Session is valid, refresh templates
      setSessionError(null);
      await loadTemplates();
      toast.success("Templates refreshed successfully");
    } catch (error) {
      console.error("Error refreshing templates:", error);
      toast.error("Error refreshing templates", {
        description: "Failed to refresh template data"
      });
    }
  };

  // Filter templates by event type
  const filteredTemplates = eventTypeFilter === "all" 
    ? templates 
    : templates.filter(template => 
        (template.eventType || "course").toLowerCase() === eventTypeFilter.toLowerCase()
      );

  // Get unique event types from templates
  const eventTypes = ["all", ...new Set(templates.map(t => (t.eventType || "course").toLowerCase()))];

  if (!authChecked) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Templates</CardTitle>
          <CardDescription>
            Manage your event templates and schedule events/courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Templates</CardTitle>
          <CardDescription>
            Manage your event templates and schedule events/courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-gray-500">
            <Alert variant="destructive">
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You need admin privileges to access this area.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessionError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event Templates</CardTitle>
          <CardDescription>
            Manage your event templates and schedule events/courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                {sessionError}
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button onClick={() => window.location.href = "/auth"}>
                Go to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Event Templates</CardTitle>
          <CardDescription>
            Manage your event templates and schedule course/event instances
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          {isUpdating && (
            <div className="flex items-center text-sm text-muted-foreground mr-2">
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
          <Button onClick={handleManualRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!isLoading && templates.length > 0 && (
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium">Filter:</span>
              <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All event types" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2 sm:mt-0 sm:ml-auto">
              Sync mode: <span className="font-medium">{templateSyncMode === 'always' ? 'Automatic' : templateSyncMode === 'prompt' ? 'Ask before syncing' : 'Manual'}</span>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <TemplateLoadingState />
        ) : filteredTemplates.length === 0 ? (
          templates.length === 0 ? (
            <EmptyTemplateState />
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>No templates found with the selected event type.</p>
            </div>
          )
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {filteredTemplates.map((template) => (
                <CourseTemplateCard
                  key={template.id}
                  template={template as CourseTemplate}
                  onEdit={(courseTemplate: CourseTemplate) => handleEditTemplate(courseTemplate as Course)}
                  onDelete={handleDeleteTemplate}
                  onSchedule={(courseTemplate: CourseTemplate) => handleScheduleCourse(courseTemplate as Course)}
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
