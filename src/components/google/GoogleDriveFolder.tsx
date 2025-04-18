
import { GoogleAuthButton } from "./GoogleAuthButton";
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
    checkAuthStatus,
    loadFolderContents
  } = useGoogleDrive({
    courseId,
    courseTitle,
    folderId,
    onFolderCreated
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Google Drive Integration</h3>
        <GoogleAuthButton onAuthStateChange={checkAuthStatus} />
      </div>

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
          onRefreshAuth={checkAuthStatus}
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
