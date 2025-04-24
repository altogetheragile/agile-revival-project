
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface CourseErrorAlertProps {
  error: string;
  onRetry: () => void;
}

export const CourseErrorAlert = ({ error, onRetry }: CourseErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error loading courses</AlertTitle>
      <AlertDescription>
        {error}
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="bg-red-50 text-red-800 hover:bg-red-100"
          >
            <RefreshCw className="mr-1 h-3 w-3" /> Try Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
