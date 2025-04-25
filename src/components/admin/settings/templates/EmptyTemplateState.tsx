
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const EmptyTemplateState = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No templates found</AlertTitle>
      <AlertDescription>
        You haven't created any course templates yet. Add your first template to get started.
      </AlertDescription>
    </Alert>
  );
};
