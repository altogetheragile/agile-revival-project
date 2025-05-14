
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSiteSettings } from "@/contexts/site-settings";
import { CourseTemplatesSettings } from "./CourseTemplatesSettings";

export const TemplateSettings = () => {
  const { settings, updateSettings, isLoading } = useSiteSettings();
  
  // Get template sync mode from settings, default to "prompt"
  const syncMode = settings.templates?.syncMode || "prompt";
  
  const handleSyncModeChange = (value: string) => {
    // Update just the syncMode within templates settings
    const updatedTemplateSettings = {
      ...(settings.templates || {}),
      syncMode: value
    };
    
    updateSettings("templates", updatedTemplateSettings);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template Settings</CardTitle>
          <CardDescription>
            Configure how changes to templates affect linked courses and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Template Update Propagation</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Control how changes to templates affect courses created from them
              </p>
              
              <RadioGroup
                value={syncMode}
                onValueChange={handleSyncModeChange}
                className="space-y-3"
                disabled={isLoading}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="always" id="always" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="always" className="font-normal">
                      Always update courses automatically
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Any changes to templates will automatically update all courses created from them
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="prompt" id="prompt" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="prompt" className="font-normal">
                      Ask before updating (Recommended)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show a confirmation dialog before updating courses when a template changes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="never" id="never" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="never" className="font-normal">
                      Never update automatically
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Changes to templates will not affect existing courses
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CourseTemplatesSettings />
    </div>
  );
};
