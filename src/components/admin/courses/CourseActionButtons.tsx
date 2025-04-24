
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface CourseActionButtonsProps {
  onForceReset: () => void;
  isLoading: boolean;
}

export const CourseActionButtons = ({ onForceReset, isLoading }: CourseActionButtonsProps) => {
  return (
    <div className="mb-4 flex justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={onForceReset}
        className="text-blue-600 border-blue-300 hover:bg-blue-50"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        Refresh Data
      </Button>
    </div>
  );
};
