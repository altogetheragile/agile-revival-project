
import React from "react";
import { Button } from "@/components/ui/button";
import { Save, Send } from "lucide-react";

interface CourseFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isDraft?: boolean;
}

export const CourseFormActions: React.FC<CourseFormActionsProps> = ({ 
  onCancel,
  isEditing,
  isDraft = true
}) => {
  return (
    <div className="flex justify-end space-x-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" className="gap-2">
        {isDraft ? (
          <Save className="h-4 w-4" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {isEditing 
          ? (isDraft ? "Save as Draft" : "Update & Publish")
          : (isDraft ? "Save as Draft" : "Publish Course")
        }
      </Button>
    </div>
  );
};
