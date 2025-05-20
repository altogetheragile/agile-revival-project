
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";

interface InstructorPriceSectionProps {
  form: UseFormReturn<CourseFormData>;
  disabled?: boolean;
}

export const InstructorPriceSection: React.FC<InstructorPriceSectionProps> = ({ form, disabled = false }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Instructor Field */}
      <FormField
        control={form.control}
        name="instructor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instructor</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., John Smith" 
                disabled={disabled}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Price Field */}
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., £1,200 + VAT" 
                disabled={disabled}
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
