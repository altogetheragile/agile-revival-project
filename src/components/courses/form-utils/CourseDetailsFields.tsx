
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData } from "@/types/course";
import { useEventTypeManagement } from "@/hooks/useEventTypeManagement";
import { EventSection } from "./course-details/EventSection";
import { InstructorPriceSection } from "./course-details/InstructorPriceSection";
import { FormatLevelSection } from "./course-details/FormatLevelSection";
import { AvailableSpotsField } from "./course-details/AvailableSpotsField";
import { LearningOutcomeField } from "./LearningOutcomeField";
import { AudienceSection } from "./course-details/AudienceSection";

interface CourseDetailsFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

export const CourseDetailsFields: React.FC<CourseDetailsFieldsProps> = ({ form }) => {
  // Use the event type management hook to get event types
  const {
    eventTypes,
    addMode: eventTypeAddMode,
    setAddMode: setEventTypeAddMode,
    newEventType,
    setNewEventType,
    handleAddEventType,
    handleDeleteEventType
  } = useEventTypeManagement();

  // Create a handler for the delete button that matches the expected prop type
  const handleEventTypeDelete = (value: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDeleteEventType(value, () => {
      // Simple noop callback function to satisfy the second parameter requirement
      // If the currently selected value was deleted, you might want to reset the field
      if (form.getValues("eventType") === value) {
        form.setValue("eventType", "");
      }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Event Details</h3>
      
      {/* Event Type and Category Selection */}
      <EventSection 
        form={form} 
        eventTypes={eventTypes} 
        onEventTypeDelete={handleEventTypeDelete} 
      />
      
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
