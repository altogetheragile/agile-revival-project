
import React from "react";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";

interface CourseStatusFieldProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseStatusField: React.FC<CourseStatusFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Course Status</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="status-draft" />
                <Label htmlFor="status-draft" className="font-medium">Draft</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="published" id="status-published" />
                <Label htmlFor="status-published" className="font-medium">Published</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormDescription>
            Draft courses are only visible to administrators and can be edited. Published courses are visible to everyone.
          </FormDescription>
        </FormItem>
      )}
    />
  );
};
