
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ScheduleCourseFormData } from "@/types/course";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ScheduleStatusFieldProps {
  form: UseFormReturn<ScheduleCourseFormData>;
}

export const ScheduleStatusField: React.FC<ScheduleStatusFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Publication Status</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="draft" id="draft" />
                <Label htmlFor="draft">Draft - Only visible to admins</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="published" id="published" />
                <Label htmlFor="published">Published - Visible to everyone</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
