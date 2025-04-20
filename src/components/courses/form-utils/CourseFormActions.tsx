
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
  const SaveButton = () => (
    <Button type="submit" className="ml-auto bg-green-600 hover:bg-green-700 text-white">
      <Save className="mr-2 h-4 w-4" />
      {isEditing ? "Save Draft" : "Save Draft"}
      {isTemplate ? " Template" : " Course"}
    </Button>
  );

  const PublishButton = () => (
    <Button type="submit" variant="secondary" className="ml-2 bg-green-600 hover:bg-green-700 text-white">
      <Send className="mr-2 h-4 w-4" />
      {isEditing && !isDraft ? "Update Published Course" : "Publish Course"}
    </Button>
  );

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <DialogClose asChild>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </DialogClose>

      {/* Use DialogClose conditionally based on stayOpenOnSubmit */}
      {stayOpenOnSubmit ? (
        <>
          <SaveButton />
          {isDraft && <PublishButton />}
        </>
      ) : (
        <>
          <DialogClose asChild>
            <SaveButton />
          </DialogClose>

          {isDraft && (
            <DialogClose asChild>
              <PublishButton />
            </DialogClose>
          )}
        </>
      )}
    </div>
  );
};
