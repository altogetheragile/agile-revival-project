
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface CourseImageActionsProps {
  handleRefreshImage: () => void;
  handleRemoveImage: () => void;
  onOpenMediaLibrary: () => void;
}

export const CourseImageActions: React.FC<CourseImageActionsProps> = ({
  handleRefreshImage,
  handleRemoveImage,
  onOpenMediaLibrary
}) => {
  return (
    <>
      <Button
        className="ml-2"
        type="button"
        size="sm"
        variant="secondary"
        onClick={onOpenMediaLibrary}
      >
        Choose from Library
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="ml-2 text-blue-500 border-blue-200"
        onClick={handleRefreshImage}
      >
        <RefreshCw className="h-3.5 w-3.5 mr-1" />
        Refresh Image
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="ml-2 text-red-500 border-red-200"
        onClick={handleRemoveImage}
      >
        Remove Image
      </Button>
    </>
  );
};

export default CourseImageActions;
