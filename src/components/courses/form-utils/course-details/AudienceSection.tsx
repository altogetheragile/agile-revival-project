
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";

interface AudienceSectionProps {
  form: UseFormReturn<CourseFormData>;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({ form }) => {
  return (
    <>
      {/* Prerequisites Field */}
      <FormField
        control={form.control}
        name="prerequisites"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prerequisites</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="What participants need to know before attending"
                className="min-h-20"
                {...field} 
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Target Audience Field */}
      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Audience</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Who is this event for?"
                className="min-h-20"
                {...field}
                value={field.value || ""} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
