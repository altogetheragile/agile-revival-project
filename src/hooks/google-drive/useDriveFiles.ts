
import { useState, useCallback } from "react";
import { getFolderContents, uploadFileToDrive } from "@/integrations/google/drive";
import { useToast } from "@/hooks/use-toast";

interface UseDriveFilesProps {
  folderId?: string;
}

export const useDriveFiles = ({ folderId }: UseDriveFilesProps) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const loadFolderContents = useCallback(async () => {
    if (!folderId) return;
    
    setIsLoading(true);
    try {
      const result = await getFolderContents(folderId);
      setFiles(result.files || []);
    } catch (error) {
      console.error("Error loading folder contents:", error);
      toast({
        title: "Error",
        description: "Could not load files from Google Drive",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [folderId, toast]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!folderId) {
      toast({
        title: "Error",
        description: "No folder selected",
        variant: "destructive"
      });
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
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
          toast({
            title: "Upload failed",
            description: `Could not upload ${file.name}`,
            variant: "destructive"
          });
        }
      }
    } finally {
      if (uploadSuccessful) {
        await loadFolderContents();
      }
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return {
    files,
    isLoading,
    isUploading,
    loadFolderContents,
    handleFileUpload
  };
};
