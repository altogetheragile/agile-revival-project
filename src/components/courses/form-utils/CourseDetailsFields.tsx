
import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { useSkillLevelManagement } from "@/hooks/useSkillLevelManagement";
import { SkillLevelInput } from "./SkillLevelInput";
import { SkillLevelSelect } from "./SkillLevelSelect";

interface CourseDetailsFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseDetailsFields: React.FC<CourseDetailsFieldsProps> = ({ form }) => {
  // Use custom skill level management
  const {
    skillLevels,
    addMode,
    setAddMode,
    newSkillLevel,
    setNewSkillLevel,
    handleAddSkillLevel,
    handleDeleteSkillLevel,
  } = useSkillLevelManagement();

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
            {addMode ? (
              <SkillLevelInput
                value={newSkillLevel}
                onChange={setNewSkillLevel}
                onAdd={() => handleAddSkillLevel((value) => field.onChange(value))}
                onCancel={() => {
                  setAddMode(false);
                  setNewSkillLevel("");
                }}
              />
            ) : (
              <FormControl>
                <SkillLevelSelect
                  skillLevels={skillLevels}
                  value={field.value ?? ""}
                  onValueChange={val => {
                    if (val === "__add_skill_level__") {
                      setAddMode(true);
                    } else {
                      field.onChange(val);
                    }
                  }}
                  onDelete={(value, e) => {
                    handleDeleteSkillLevel(value, deletedValue => {
                      // If currently selected skillLevel was deleted, reset to first available or empty
                      if (field.value === deletedValue) {
                        field.onChange(skillLevels[0]?.value ?? "");
                      }
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
