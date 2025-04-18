
import { FolderCreationForm } from "./drive/FolderCreationForm";
import { FileList } from "./drive/FileList";
import { DriveError } from "./drive/DriveError";
import { useGoogleDrive } from "@/hooks/useGoogleDrive";

interface GoogleDriveFolderProps {
  courseId: string;
  courseTitle: string;
  folderId?: string;
  folderUrl?: string;
  onFolderCreated: (folderId: string, folderUrl: string) => void;
}

export const GoogleDriveFolder: React.FC<GoogleDriveFolderProps> = ({
  courseId,
  courseTitle,
  folderId,
  folderUrl,
  onFolderCreated
}) => {
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
    loadFolderContents
  } = useGoogleDrive({
    courseId,
    courseTitle,
    folderId,
    onFolderCreated
  });

  if (!isAuthenticated) {
    return (
      <div className="text-sm text-muted-foreground">
        Please connect to Google Drive in Site Settings to manage course materials.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <DriveError error={error} apiEnableUrl={apiEnableUrl} />
      )}

      {!folderId ? (
        <FolderCreationForm
          folderName={folderName}
          onFolderNameChange={setFolderName}
          onCreateFolder={handleCreateFolder}
          isAuthenticated={isAuthenticated}
          isCreating={isCreating}
          onRefreshAuth={() => {}}
        />
      ) : (
        <FileList
          files={files}
          isLoading={isLoading}
          folderUrl={folderUrl}
          onUpload={handleFileUpload}
          isUploading={isUploading}
          onRefresh={loadFolderContents}
        />
      )}
    </div>
  );
};

