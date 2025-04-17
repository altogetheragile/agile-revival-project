
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink } from "lucide-react";

interface DriveErrorProps {
  error: string;
  apiEnableUrl: string | null;
}

export const DriveError = ({ error, apiEnableUrl }: DriveErrorProps) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{apiEnableUrl ? "API Not Enabled" : "Error"}</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error}</p>
        {apiEnableUrl && (
          <div className="mt-2">
            <p className="font-medium mb-1">Please enable the Google Drive API:</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Click the button below to open the Google Cloud Console</li>
              <li>Click the "Enable" button on the Google Cloud page</li>
              <li>Wait a few minutes for changes to propagate</li>
              <li>Return here and try again</li>
            </ol>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 flex items-center gap-1"
              onClick={() => window.open(apiEnableUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Enable Google Drive API
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
