
import { Loader2 } from "lucide-react";

export const CourseLoadingState = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      <span className="ml-3 text-gray-500">Loading course templates...</span>
    </div>
  );
};
