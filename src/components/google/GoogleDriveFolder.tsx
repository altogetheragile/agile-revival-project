
import { useState, useEffect } from "react";
import { 
  createDriveFolder, 
  getFolderContents, 
  isGoogleAuthenticated, 
  uploadFileToDrive 
} from "@/integrations/google/drive";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { useToast } from "@/hooks/use-toast";
import { FolderCreationForm } from "./drive/FolderCreationForm";
import { FileList } from "./drive/FileList";
import { DriveError } from "./drive/DriveError";

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
  const [isAuthenticated, setIsAuthenticated] = useState(isGoogleAuthenticated());
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [folderName, setFolderName] = useState(`Course: ${courseTitle}`);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiEnableUrl, setApiEnableUrl] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (courseTitle && !folderId) {
      setFolderName(`Course: ${courseTitle}`);
    }
  }, [courseTitle]);

  useEffect(() => {
    if (folderId && isAuthenticated) {
      loadFolderContents();
    }
  }, [folderId, isAuthenticated]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authStatus = isGoogleAuthenticated();
    console.log("Authentication check result:", authStatus);
    setIsAuthenticated(authStatus);
    setLastChecked(new Date());
  };

  const loadFolderContents = async () => {
    if (!folderId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFolderContents(folderId);
      setFiles(result.files || []);
    } catch (error) {
      console.error("Error loading folder contents:", error);
      setError(`Could not load files from Google Drive: ${error.message || 'Unknown error'}`);
      checkForApiEnableUrl(error.message);
      toast({
        title: "Error",
        description: "Could not load files from Google Drive",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkForApiEnableUrl = (errorMessage: string) => {
    const match = errorMessage?.match(/https:\/\/console\.developers\.google\.com\/apis\/api\/drive\.googleapis\.com\/overview\?project=[0-9]+/);
    setApiEnableUrl(match ? match[0] : null);
  };

  const handleCreateFolder = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please connect to Google Drive first",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setError(null);
    setApiEnableUrl(null);
    try {
      const result = await createDriveFolder(folderName);
      
      if (result && result.id && result.webViewLink) {
        onFolderCreated(result.id, result.webViewLink);
        toast({
          title: "Folder created",
          description: "Successfully created Google Drive folder"
        });
        setFiles([]);
        await loadFolderContents();
      } else {
        throw new Error("Invalid folder creation response");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      const errorMessage = error.message || 'Unknown error';
      setError(`Failed to create Google Drive folder: ${errorMessage}`);
      checkForApiEnableUrl(errorMessage);
      toast({
        title: "Error",
        description: "Failed to create Google Drive folder",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!folderId || !isAuthenticated) {
      toast({
        title: "Error",
        description: "No folder selected or not authenticated",
        variant: "destructive"
      });
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await uploadFileToDrive(file, folderId);
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded to Google Drive`
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload failed",
          description: `Could not upload ${file.name}`,
          variant: "destructive"
        });
      }
    }
    
    await loadFolderContents();
    setIsUploading(false);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Google Drive Integration</h3>
        <GoogleAuthButton onAuthStateChange={setIsAuthenticated} />
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
        />
      )}
    </div>
  );
};
