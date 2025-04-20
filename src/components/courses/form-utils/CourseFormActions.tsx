
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Save, Send } from "lucide-react";

interface CourseFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isDraft: boolean;
  stayOpenOnSubmit?: boolean;
  isTemplate?: boolean;
}

export const CourseFormActions: React.FC<CourseFormActionsProps> = ({
  onCancel,
  isEditing,
  isDraft,
  stayOpenOnSubmit = false,
  isTemplate = false,
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <DialogClose asChild>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </DialogClose>

      {stayOpenOnSubmit ? (
        // If we're staying open, use regular buttons
        <Button 
          type="submit" 
          className="ml-auto bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? "Save Changes" : "Save"}
        </Button>
      ) : (
        // If we're closing on submit, use DialogClose
        <DialogClose asChild>
          <Button 
            type="submit" 
            className="ml-auto bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Save Changes" : "Save"}
          </Button>
        </DialogClose>
      )}
    </div>
  );
};
