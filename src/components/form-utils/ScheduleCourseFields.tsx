
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { DateRangeFields } from "@/components/form-utils/DateRangeFields";
import { ScheduleCourseFormData } from "@/types/course";

interface ScheduleCourseFieldsProps {
  form: UseFormReturn<ScheduleCourseFormData>;
  required?: boolean;
  startFieldLabel?: string;
  endFieldLabel?: string;
  className?: string;
}

// This is a typed wrapper that avoids needing to use generics in JSX
export function ScheduleCourseFields({
  form,
  required = false,
  startFieldLabel = "Start Date",
  endFieldLabel = "End Date",
  className
}: ScheduleCourseFieldsProps) {
  return (
    <DateRangeFields
      form={form}
      required={required}
      startField="startDate"
      endField="endDate"
      startFieldLabel={startFieldLabel}
      endFieldLabel={endFieldLabel}
      className={className}
    />
  );
}
