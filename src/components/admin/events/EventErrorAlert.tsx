
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface EventErrorAlertProps {
  error: string;
  onRetry: () => void;
}

export const EventErrorAlert: React.FC<EventErrorAlertProps> = ({ error, onRetry }) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error loading events</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{error}</p>
        <Button 
          onClick={onRetry} 
          variant="outline" 
          className="w-fit mt-2"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};
