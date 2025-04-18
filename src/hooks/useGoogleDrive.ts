
import { useState, useEffect, useCallback } from "react";
import { createDriveFolder, getFolderContents, uploadFileToDrive } from "@/integrations/google/drive";
import { isGoogleAuthenticated } from "@/integrations/google/drive";
import { useToast } from "@/hooks/use-toast";

interface UseGoogleDriveProps {
  courseId: string;
  courseTitle: string;
  folderId?: string;
  onFolderCreated?: (folderId: string, folderUrl: string) => void;
}

export const useGoogleDrive = ({ courseId, courseTitle, folderId, onFolderCreated }: UseGoogleDriveProps) => {
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

  const checkAuthStatus = useCallback(() => {
    const authStatus = isGoogleAuthenticated();
    console.log("Authentication check result:", authStatus);
    setIsAuthenticated(authStatus);
    setLastChecked(new Date());
  }, []);

  const checkForApiEnableUrl = useCallback((errorMessage: string) => {
    const match = errorMessage?.match(/https:\/\/console\.developers\.google\.com\/apis\/api\/drive\.googleapis\.com\/overview\?project=[0-9]+/);
    setApiEnableUrl(match ? match[0] : null);
  }, []);

  const loadFolderContents = useCallback(async () => {
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
  }, [folderId, toast, checkForApiEnableUrl]);

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
        if (onFolderCreated) {
          onFolderCreated(result.id, result.webViewLink);
        }
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
    setError(null);
    
    let uploadSuccessful = false;
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          await uploadFileToDrive(file, folderId);
          uploadSuccessful = true;
          toast({
            title: "Upload successful",
            description: `${file.name} has been uploaded to Google Drive`
          });
        } catch (error) {
          console.error("Upload error:", error);
          const errorMessage = error.message || 'Unknown error';
          setError(`Failed to upload ${file.name}: ${errorMessage}`);
          checkForApiEnableUrl(errorMessage);
          toast({
            title: "Upload failed",
            description: `Could not upload ${file.name}`,
            variant: "destructive"
          });
        }
      }
    } finally {
      // Regardless of success/failure, refresh the file list
      if (uploadSuccessful) {
        await loadFolderContents();
      }
      setIsUploading(false);
      e.target.value = '';
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
    loadFolderContents // Export this to allow manual refresh
  };
};
