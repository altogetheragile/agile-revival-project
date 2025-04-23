
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface StorageErrorsProps {
  error: string | null;
  bucketExists: boolean;
}

export const StorageErrors: React.FC<StorageErrorsProps> = ({ error, bucketExists }) => {
  if (!error && bucketExists) return null;
  
  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Storage Error</AlertTitle>
          <AlertDescription className="whitespace-pre-wrap">
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {!bucketExists && (
        <Card className="border-red-200 bg-red-50 mb-4">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-700">Media Storage Configuration Required</h3>
                <p className="text-sm text-red-700 mt-1">
                  The media storage bucket has not been created or is not accessible. Please create a "media" bucket 
                  in your Supabase project and ensure it's set to public with the correct CORS settings.
                </p>
                <p className="text-sm font-medium text-red-700 mt-2">
                  After creating the bucket, click the Refresh button below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
