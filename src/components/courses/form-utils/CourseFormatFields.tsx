
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
                  onAdd={() => {
                    console.log("Format add triggered with value:", newFormat);
                    handleAddFormat().then(formatValue => {
                      console.log("Format added successfully:", formatValue);
                      if (formatValue) {
                        field.onChange(formatValue);
                      }
                    }).catch(err => {
                      console.error("Error adding format:", err);
                    });
                  }}
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
                  onDelete={(formatValue, e) => {
                    console.log("Format delete triggered for:", formatValue);
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteFormat(formatValue).then(success => {
                      console.log("Format deleted result:", success);
                      if (success && field.value === formatValue) {
                        field.onChange("");
                      }
                    }).catch(err => {
                      console.error("Error deleting format:", err);
                    });
                  }}
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
