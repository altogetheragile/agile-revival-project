
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { FormatSelect } from "../FormatSelect";
import { SkillLevelSelect } from "../SkillLevelSelect";

interface FormatLevelSectionProps {
  form: UseFormReturn<CourseFormData>;
}

export const FormatLevelSection: React.FC<FormatLevelSectionProps> = ({ form }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Format Select */}
      <FormField
        control={form.control}
        name="format"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Format</FormLabel>
            <FormControl>
              <FormatSelect
                value={field.value || "in-person"}
                onValueChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Skill Level Select */}
      <FormField
        control={form.control}
        name="skillLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skill Level</FormLabel>
            <FormControl>
              <SkillLevelSelect
                value={field.value || "all-levels"}
                onValueChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
