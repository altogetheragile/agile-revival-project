
import React from "react";
import { Button } from "@/components/ui/button";

interface EventFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
}

export const EventFormActions: React.FC<EventFormActionsProps> = ({ 
  onCancel,
  isEditing
}) => {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEditing ? "Update Event" : "Create Event"}
      </Button>
    </div>
  );
};
