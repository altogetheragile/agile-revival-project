
import React from "react";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MediaStorageAlertProps {
  error: string | null;
  bucketExists: boolean;
}

export const MediaStorageAlert: React.FC<MediaStorageAlertProps> = ({
  error,
  bucketExists
}) => {
  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
        <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-700">Storage Error</h3>
          <p className="text-sm text-red-700 whitespace-pre-wrap">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!bucketExists) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
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
    );
  }
  
  return null;
};
