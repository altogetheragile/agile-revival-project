
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EventFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
  customSubmitText?: React.ReactNode;
}

export const EventFormActions: React.FC<EventFormActionsProps> = ({ 
  onCancel,
  isEditing,
  isSubmitting = false,
  customSubmitText
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
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
            {customSubmitText ? customSubmitText : isEditing ? "Updating..." : "Creating..."}
          </>
        ) : (
          customSubmitText ? customSubmitText : isEditing ? "Update Event" : "Create Event"
        )}
      </Button>
    </div>
  );
};
