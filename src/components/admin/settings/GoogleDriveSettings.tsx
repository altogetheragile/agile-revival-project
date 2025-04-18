
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleAuthButton } from "@/components/google/GoogleAuthButton";
import { DriveError } from "@/components/google/drive/DriveError";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";

export const GoogleDriveSettings = () => {
  const {
    isAuthenticated,
    error,
    apiEnableUrl,
    checkAuthStatus,
  } = useGoogleDrive({
    courseId: "main",
    courseTitle: "Main",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Connect to Google Drive to enable course materials storage across the platform.
          </p>
          <GoogleAuthButton onAuthStateChange={checkAuthStatus} />
        </div>

        {error && (
          <DriveError error={error} apiEnableUrl={apiEnableUrl} />
        )}
      </CardContent>
    </Card>
  );
};
