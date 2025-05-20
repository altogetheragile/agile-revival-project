
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ScheduleCourseFormData } from "@/types/course";
import { ScheduleCourseFields } from "@/components/form-utils/ScheduleCourseFields";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ScheduleFormFieldsProps {
  form: UseFormReturn<ScheduleCourseFormData>;
}

export const ScheduleFormFields: React.FC<ScheduleFormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      {/* Date Range Fields */}
      <ScheduleCourseFields
        form={form}
        required={true}
      />
      
      {/* Location Field */}
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="e.g., London" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Instructor Field */}
      <FormField
        control={form.control}
        name="instructor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instructor</FormLabel>
            <FormControl>
              <Input placeholder="Instructor name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Spots Available Field */}
      <FormField
        control={form.control}
        name="spotsAvailable"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Available Spots</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1}
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
