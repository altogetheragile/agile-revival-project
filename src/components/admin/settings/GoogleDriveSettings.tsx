
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleAuthButton } from "@/components/google/GoogleAuthButton";
import { DriveError } from "@/components/google/drive/DriveError";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";
import { Separator } from "@/components/ui/separator";
import { FileList } from "@/components/google/drive/FileList";
import { FolderCreationForm } from "@/components/google/drive/FolderCreationForm";

export const GoogleDriveSettings = () => {
  const [mainFolderId, setMainFolderId] = useState<string | null>(
    localStorage.getItem("googleDriveMainFolderId")
  );
  const [mainFolderUrl, setMainFolderUrl] = useState<string | null>(
    localStorage.getItem("googleDriveMainFolderUrl")
  );

  const {
    isAuthenticated,
    isCreating,
    isUploading,
    folderName,
    files,
    isLoading,
    error,
    apiEnableUrl,
    setFolderName,
    handleCreateFolder,
    handleFileUpload,
    checkAuthStatus,
    loadFolderContents
  } = useGoogleDrive({
    courseId: "main",
    courseTitle: "Course Materials",
    folderId: mainFolderId || undefined,
    onFolderCreated: (folderId, folderUrl) => {
      setMainFolderId(folderId);
      setMainFolderUrl(folderUrl);
      localStorage.setItem("googleDriveMainFolderId", folderId);
      localStorage.setItem("googleDriveMainFolderUrl", folderUrl);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Drive Integration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Connect to Google Drive to store and manage course materials. This will be used across all courses.
          </p>
          <GoogleAuthButton onAuthStateChange={checkAuthStatus} />
        </div>

        {error && (
          <DriveError error={error} apiEnableUrl={apiEnableUrl} />
        )}

        <Separator className="my-4" />

        {!mainFolderId ? (
          <FolderCreationForm
            folderName={folderName}
            onFolderNameChange={setFolderName}
            onCreateFolder={handleCreateFolder}
            isAuthenticated={isAuthenticated}
            isCreating={isCreating}
            onRefreshAuth={checkAuthStatus}
          />
        ) : (
          <FileList
            files={files}
            isLoading={isLoading}
            folderUrl={mainFolderUrl || undefined}
            onUpload={handleFileUpload}
            isUploading={isUploading}
            onRefresh={loadFolderContents}
          />
        )}
      </CardContent>
    </Card>
  );
};
