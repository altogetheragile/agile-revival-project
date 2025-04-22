
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { Check } from "lucide-react";

interface CourseDetailsFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

// Map values to labels for clarity
const skillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all-levels", label: "All Levels" },
];

export const CourseDetailsFields: React.FC<CourseDetailsFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration</FormLabel>
            <FormControl>
              <Input placeholder="e.g. 2 days, 16 hours" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="skillLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skill Level</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a skill level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white shadow-xl border border-gray-200 z-50 rounded-xl px-0 py-0 min-w-[250px]">
                {skillLevels.map(opt => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className={
                      // shadcn/ui's SelectItem already highlights selected via focus,
                      // We'll customize further for pastel green.
                      "data-[state=checked]:bg-[#F2FCE2] data-[state=checked]:text-black text-md px-8 py-2 relative cursor-pointer"
                    }
                  >
                    {/* Custom checkmark absolutely positioned for left alignment */}
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center h-5 w-5">
                      {/* Only show icon if selected */}
                      {field.value === opt.value && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </span>
                    <span className="pl-6">{opt.label}</span>
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
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Audience</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Who is this course for?"
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="prerequisites"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prerequisites</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any requirements before taking this course?"
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

