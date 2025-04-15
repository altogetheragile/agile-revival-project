
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";

interface LearningOutcomeFieldProps {
  form: UseFormReturn<CourseFormData>;
}

export const LearningOutcomeField: React.FC<LearningOutcomeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="learningOutcomes"
      render={({ field }) => {
        // Handle the case where learningOutcomes is an array
        const value = Array.isArray(field.value)
          ? field.value.join('\n')
          : field.value || '';
            
        return (
          <FormItem>
            <FormLabel>Learning Outcomes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter learning outcomes (one per line)"
                className="min-h-[120px]"
                value={value}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormDescription>
              Enter each learning outcome on a new line
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
