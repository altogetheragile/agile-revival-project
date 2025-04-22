
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
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { useCourseFormatManagement } from "@/hooks/useCourseFormatManagement";
import { FormatSelect } from "./FormatSelect";
import { FormatInput } from "./FormatInput";

interface CourseFormatFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseFormatFields: React.FC<CourseFormatFieldsProps> = ({ form }) => {
  const {
    formats,
    addMode,
    setAddMode,
    newFormat,
    setNewFormat,
    handleAddFormat,
    handleDeleteFormat
  } = useCourseFormatManagement();

  const handleFormatAdd = async () => {
    console.log("Format add triggered with value:", newFormat);
    try {
      const formatValue = await handleAddFormat();
      console.log("Format add result:", formatValue);
      if (formatValue) {
        // Update the form field with the new format value
        form.setValue("format", formatValue);
      }
    } catch (err) {
      console.error("Error in handleFormatAdd:", err);
    }
  };

  const handleFormatDelete = async (value: string, e: React.MouseEvent) => {
    console.log("Format delete triggered for:", value);
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const success = await handleDeleteFormat(value);
      console.log("Format delete result:", success);
      
      // If the deleted format was selected, clear the selection
      if (success && form.getValues("format") === value) {
        form.setValue("format", "");
      }
    } catch (err) {
      console.error("Error in handleFormatDelete:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="format"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course Format</FormLabel>
            {addMode ? (
              <FormControl>
                <FormatInput
                  value={newFormat}
                  onChange={setNewFormat}
                  onAdd={handleFormatAdd}
                  onCancel={() => {
                    console.log("Format add cancelled");
                    setAddMode(false);
                    setNewFormat("");
                  }}
                />
              </FormControl>
            ) : (
              <FormControl>
                <FormatSelect
                  formats={formats}
                  value={field.value || ""}
                  onValueChange={(value) => {
                    console.log("Format selected:", value);
                    if (value === "__add_format__") {
                      setAddMode(true);
                    } else {
                      field.onChange(value);
                    }
                  }}
                  onDelete={handleFormatDelete}
                />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Publication Status</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="draft">Save as Draft</SelectItem>
                <SelectItem value="published">Publish Immediately</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
