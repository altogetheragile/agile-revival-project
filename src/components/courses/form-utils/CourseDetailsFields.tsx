
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { InstructorPriceSection } from "./course-details/InstructorPriceSection";
import { FormatLevelSection } from "./course-details/FormatLevelSection";
import { AvailableSpotsField } from "./course-details/AvailableSpotsField";
import { LearningOutcomeField } from "./LearningOutcomeField";
import { AudienceSection } from "./course-details/AudienceSection";

interface CourseDetailsFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseDetailsFields: React.FC<CourseDetailsFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Event Details</h3>
      
      {/* Instructor and Price Fields */}
      <InstructorPriceSection form={form} />
      
      {/* Format and Skill Level */}
      <FormatLevelSection form={form} />
      
      {/* Available Spots Field */}
      <AvailableSpotsField form={form} />

      {/* Learning Outcomes Field */}
      <LearningOutcomeField form={form} />
      
      {/* Prerequisites and Target Audience */}
      <AudienceSection form={form} />
    </div>
  );
};
