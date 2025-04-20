
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { COURSE_CATEGORIES } from "@/constants/courseCategories";

interface CourseCategoryFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseCategoryFields: React.FC<CourseCategoryFieldsProps> = ({ form }) => {
  // We typically do not want "all" as an option when creating a course.
  const categoryOptions = COURSE_CATEGORIES.filter(cat => cat.value !== "all");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categoryOptions.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="spotsAvailable"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Available Spots</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                {...field}
                onChange={e => field.onChange(e.target.valueAsNumber || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
