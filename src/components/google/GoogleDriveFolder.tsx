
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
import { FileText, FolderOpen, Link, Upload, X, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [error, setError] = useState<string | null>(null);
  const [apiEnableUrl, setApiEnableUrl] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
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
    const checkAuth = () => {
      const authStatus = isGoogleAuthenticated();
      console.log("Authentication check result:", authStatus);
      setIsAuthenticated(authStatus);
      setLastChecked(new Date());
    };
    
    checkAuth();
  }, []);

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
    // Extract API enable URL from error message if present
    const match = errorMessage?.match(/https:\/\/console\.developers\.google\.com\/apis\/api\/drive\.googleapis\.com\/overview\?project=[0-9]+/);
    if (match) {
      setApiEnableUrl(match[0]);
    } else {
      setApiEnableUrl(null);
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
    setError(null);
    setApiEnableUrl(null);
    try {
      console.log("Starting folder creation for:", folderName);
      const result = await createDriveFolder(folderName);
      console.log("Folder creation result:", result);
      
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

  const refreshAuthStatus = () => {
    const authStatus = isGoogleAuthenticated();
    setIsAuthenticated(authStatus);
    setLastChecked(new Date());
    toast({
      title: "Authentication status refreshed",
      description: authStatus ? "You are authenticated with Google Drive" : "Not authenticated with Google Drive"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Google Drive Integration</h3>
        <GoogleAuthButton onAuthStateChange={setIsAuthenticated} />
      </div>

      {error && (
        <Alert variant={apiEnableUrl ? "warning" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{apiEnableUrl ? "API Not Enabled" : "Error"}</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{error}</p>
            {apiEnableUrl && (
              <div className="mt-2">
                <p className="font-medium mb-1">Please enable the Google Drive API:</p>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>Click the button below to open the Google Cloud Console</li>
                  <li>Click the "Enable" button on the Google Cloud page</li>
                  <li>Wait a few minutes for changes to propagate</li>
                  <li>Return here and try again</li>
                </ol>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-2 flex items-center gap-1"
                  onClick={() => window.open(apiEnableUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Enable Google Drive API
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

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
          
          <div className="flex gap-2">
            <Button 
              onClick={handleCreateFolder} 
              disabled={!isAuthenticated || !folderName || isCreating}
              className="flex-grow"
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              {isCreating ? "Creating folder..." : "Create Google Drive Folder"}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={refreshAuthStatus}
              title="Refresh authentication status"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-gray-400 mt-1 p-2 bg-gray-50 rounded">
            <div className="font-medium">Debug Information:</div>
            <div>Authentication Status: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
            <div>Last Checked: {lastChecked ? lastChecked.toLocaleTimeString() : 'Not checked'}</div>
            <div>Folder Name: {folderName || 'Not set'}</div>
            <div>Current URL: {window.location.href}</div>
            <div>Redirect Path: /auth/google/callback</div>
          </div>
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
