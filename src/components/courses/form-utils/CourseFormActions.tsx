
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Eye } from "lucide-react";

export interface CourseFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isDraft: boolean;
  isSubmitting?: boolean;
  onPreview?: () => void;
}

export const CourseFormActions: React.FC<CourseFormActionsProps> = ({
  onCancel, 
  isEditing, 
  isDraft,
  isSubmitting = false,
  onPreview
}) => {
  return (
    <div className="flex justify-between pt-4">
      <div>
        {onPreview && (
          <Button
            type="button"
            variant="outline"
            onClick={onPreview}
            className="mr-2"
            disabled={isSubmitting}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEditing ? "Update" : "Create"
          )}
        </Button>
      </div>
    </div>
  );
};
