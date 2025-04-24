
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Save, Send, Eye } from "lucide-react";
import { useState, useEffect } from "react";

interface CourseFormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  isDraft: boolean;
  stayOpenOnSubmit?: boolean;
  isTemplate?: boolean;
  onPreview?: () => void;
  disablePreview?: boolean;
  formHasChanges?: boolean;
}

export const CourseFormActions: React.FC<CourseFormActionsProps> = ({
  onCancel,
  isEditing,
  isDraft,
  stayOpenOnSubmit = false,
  isTemplate = false,
  onPreview,
  disablePreview = false,
  formHasChanges = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Track when the preview was last refreshed
  const [lastPreviewRefresh, setLastPreviewRefresh] = useState<number>(0);

  const handleSubmit = (e: React.MouseEvent) => {
    setIsSubmitting(true);
    // The form will handle the actual submission
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();  // Prevent form submission
    if (onPreview) {
      // Set last preview refresh timestamp to force re-render in preview component
      setLastPreviewRefresh(Date.now());
      onPreview();
    }
  };

  // If form has changes and we're using the preview feature, enable a visual indicator
  const previewButtonClass = formHasChanges && lastPreviewRefresh ? 
    "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100" : 
    "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100";

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <DialogClose asChild>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </DialogClose>

      {(isTemplate || onPreview) && !disablePreview && (
        <Button 
          type="button" 
          variant="outline" 
          className={previewButtonClass}
          onClick={handlePreview}
        >
          <Eye className="mr-2 h-4 w-4" />
          {formHasChanges && lastPreviewRefresh > 0 ? "Refresh Preview" : "Preview Template"}
        </Button>
      )}

      {stayOpenOnSubmit ? (
        // If we're staying open, use regular buttons
        <Button 
          type="submit" 
          className="ml-auto bg-green-600 hover:bg-green-700 text-white"
          onClick={handleSubmit}
          disabled={isSubmitting}
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
