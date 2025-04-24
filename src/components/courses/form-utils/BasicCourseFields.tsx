
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";

interface BasicCourseFieldsProps {
  form: UseFormReturn<CourseFormData>;
  readOnly?: boolean;
}

export const BasicCourseFields: React.FC<BasicCourseFieldsProps> = ({ form, readOnly = false }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter course title" 
                {...field} 
                readOnly={readOnly}
                className={readOnly ? "bg-gray-100" : ""}
              />
            </FormControl>
            <FormDescription>
              The name of the course as it will appear to students.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter course description" 
                className={`min-h-32 ${readOnly ? "bg-gray-100" : ""}`}
                {...field} 
                readOnly={readOnly}
              />
            </FormControl>
            <FormDescription>
              A detailed description of what the course covers.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
