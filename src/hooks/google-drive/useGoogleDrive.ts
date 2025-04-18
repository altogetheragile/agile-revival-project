
import { useDriveAuth } from "./useDriveAuth";
import { useDriveFolder } from "./useDriveFolder";
import { useDriveFiles } from "./useDriveFiles";

interface UseGoogleDriveProps {
  courseId: string;
  courseTitle: string;
  folderId?: string;
  onFolderCreated?: (folderId: string, folderUrl: string) => void;
}

export const useGoogleDrive = ({ 
  courseId, 
  courseTitle, 
  folderId, 
  onFolderCreated 
}: UseGoogleDriveProps) => {
  const { 
    isAuthenticated, 
    error, 
    setError,
    apiEnableUrl, 
    checkForApiEnableUrl,
    checkAuthStatus 
  } = useDriveAuth();

  const {
    isCreating,
    folderName,
    setFolderName,
    handleCreateFolder: createFolder
  } = useDriveFolder({ courseId, courseTitle, onFolderCreated });

  const {
    files,
    isLoading,
    isUploading,
    loadFolderContents,
    handleFileUpload
  } = useDriveFiles({ folderId });

  const handleCreateFolder = async () => {
    try {
      await createFolder();
    } catch (error) {
      setError(error.message);
      checkForApiEnableUrl(error.message);
    }
  };

  return {
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
  };
};
