
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { DateRangeFields } from "@/components/form-utils/DateRangeFields";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CourseScheduleFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseScheduleFields: React.FC<CourseScheduleFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Schedule Information</h3>
      
      {/* Date Range Fields */}
      <DateRangeFields 
        form={form}
      />
      
      {/* Location Field */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., London or Online via Zoom" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Duration Field */}
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., 2 days, 6 hours" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
