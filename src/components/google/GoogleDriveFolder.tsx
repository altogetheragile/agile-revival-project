
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  createDriveFolder, 
  getFolderContents, 
  isGoogleAuthenticated, 
  uploadFileToDrive 
} from "@/integrations/google/drive";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { FileText, FolderOpen, Link, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface GoogleDriveFolderProps {
  courseId: string;
  courseTitle: string;
  folderId?: string;
  folderUrl?: string;
  onFolderCreated: (folderId: string, folderUrl: string) => void;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: number;
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
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (folderId && isAuthenticated) {
      loadFolderContents();
    }
  }, [folderId, isAuthenticated]);

  const loadFolderContents = async () => {
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
    try {
      const result = await createDriveFolder(folderName);
      onFolderCreated(result.id, result.webViewLink);
      toast({
        title: "Folder created",
        description: "Successfully created Google Drive folder"
      });
      // Automatically load folder contents
      setFiles([]);
      loadFolderContents();
    } catch (error) {
      console.error("Error creating folder:", error);
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
    
    // Reload folder contents
    await loadFolderContents();
    setIsUploading(false);
    
    // Reset input value to allow uploading the same file again
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Google Drive Integration</h3>
        <GoogleAuthButton onAuthStateChange={setIsAuthenticated} />
      </div>

      {!folderId && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input 
              id="folder-name" 
              value={folderName} 
              onChange={(e) => setFolderName(e.target.value)} 
              disabled={!isAuthenticated || isCreating}
            />
          </div>
          
          <Button 
            onClick={handleCreateFolder} 
            disabled={!isAuthenticated || !folderName || isCreating}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            {isCreating ? "Creating folder..." : "Create Google Drive Folder"}
          </Button>
        </div>
      )}

      {folderId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Google Drive Folder</p>
              <a 
                href={folderUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <Link className="h-3 w-3" /> 
                Open in Google Drive
              </a>
            </div>
            
            <div>
              <label htmlFor="file-upload">
                <Input 
                  id="file-upload" 
                  type="file" 
                  onChange={handleFileUpload} 
                  className="hidden"
                  multiple
                  disabled={isUploading}
                />
                <Button 
                  variant="outline" 
                  disabled={isUploading}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Files"}
                </Button>
              </label>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              {isLoading ? (
                <p className="text-center py-4 text-gray-500">Loading files...</p>
              ) : files.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No files in this folder yet.</p>
              ) : (
                <ul className="space-y-2">
                  {files.map((file) => (
                    <li key={file.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>{file.name}</span>
                      </div>
                      <a 
                        href={file.webViewLink || file.webContentLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
