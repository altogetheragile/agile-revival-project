
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";

interface AvailableSpotsFieldProps {
  form: UseFormReturn<CourseFormData>;
}

export const AvailableSpotsField: React.FC<AvailableSpotsFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="spotsAvailable"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Available Spots</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              min={0} 
              {...field} 
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
