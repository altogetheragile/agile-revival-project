
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";

interface ScheduleFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const ScheduleFields: React.FC<ScheduleFieldsProps> = ({ form }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="dates"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dates</FormLabel>
            <FormControl>
              <Input placeholder="e.g., September 15-16, 2025" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 2 days" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
