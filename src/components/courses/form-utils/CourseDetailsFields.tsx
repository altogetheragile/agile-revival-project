
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { EventTypeSelect } from "./EventTypeSelect";
import { CategorySelect } from "./CategorySelect";
import { FormatSelect } from "./FormatSelect";
import { SkillLevelSelect } from "./SkillLevelSelect";
import { LearningOutcomeField } from "./LearningOutcomeField";

interface CourseDetailsFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseDetailsFields: React.FC<CourseDetailsFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Course Details</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Event Type Select */}
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <FormControl>
                <EventTypeSelect 
                  value={field.value || ""} 
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Category Select */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategorySelect 
                  value={field.value || ""} 
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {/* Instructor Field */}
        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructor</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Smith" {...field} />
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
                <Input placeholder="e.g., £1,200 + VAT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
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
                  onChange={field.onChange}
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
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Available Spots Field */}
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

      {/* Learning Outcomes Field */}
      <LearningOutcomeField form={form} />
      
      {/* Prerequisites Field */}
      <FormField
        control={form.control}
        name="prerequisites"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prerequisites</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="What participants need to know before attending"
                className="min-h-20"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Target Audience Field */}
      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Audience</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Who is this course for?"
                className="min-h-20"
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
