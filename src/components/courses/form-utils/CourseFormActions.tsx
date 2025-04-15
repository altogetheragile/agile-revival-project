
import React from "react";
import { Button } from "@/components/ui/button";

interface CourseFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

export const CourseFormActions: React.FC<CourseFormActionsProps> = ({ 
  onCancel,
  isEditing 
}) => {
  return (
    <div className="flex justify-end space-x-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update Course" : "Create Course"}
      </Button>
    </div>
  );
};
