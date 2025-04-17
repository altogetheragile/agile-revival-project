
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderOpen, RefreshCw } from "lucide-react";

interface FolderCreationFormProps {
  folderName: string;
  onFolderNameChange: (name: string) => void;
  onCreateFolder: () => void;
  isAuthenticated: boolean;
  isCreating: boolean;
  onRefreshAuth: () => void;
}

export const FolderCreationForm = ({
  folderName,
  onFolderNameChange,
  onCreateFolder,
  isAuthenticated,
  isCreating,
  onRefreshAuth,
}: FolderCreationFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="folder-name">Folder Name</Label>
        <Input
          id="folder-name"
          value={folderName}
          onChange={(e) => onFolderNameChange(e.target.value)}
          disabled={!isAuthenticated || isCreating}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onCreateFolder}
          disabled={!isAuthenticated || !folderName || isCreating}
          className="flex-grow"
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          {isCreating ? "Creating folder..." : "Create Google Drive Folder"}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onRefreshAuth}
          title="Refresh authentication status"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
