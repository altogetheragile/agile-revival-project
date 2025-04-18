
import { useState, useCallback } from "react";
import { createDriveFolder } from "@/integrations/google/drive";
import { useToast } from "@/hooks/use-toast";

interface UseDriveFolderProps {
  courseId: string;
  courseTitle: string;
  onFolderCreated?: (folderId: string, folderUrl: string) => void;
}

export const useDriveFolder = ({ courseId, courseTitle, onFolderCreated }: UseDriveFolderProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [folderName, setFolderName] = useState(`Course: ${courseTitle}`);
  const { toast } = useToast();

  const handleCreateFolder = async () => {
    setIsCreating(true);
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
        return result;
      } else {
        throw new Error("Invalid folder creation response");
      }
    } catch (error) {
      console.error("Error creating folder:", error);
      const errorMessage = error.message || 'Unknown error';
      toast({
        title: "Error",
        description: "Failed to create Google Drive folder",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    isCreating,
    folderName,
    setFolderName,
    handleCreateFolder
  };
};
