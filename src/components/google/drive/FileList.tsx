
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Link, Upload, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  size?: number;
}

interface FileListProps {
  files: DriveFile[];
  isLoading: boolean;
  folderUrl?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  onRefresh?: () => void;
}

export const FileList = ({
  files,
  isLoading,
  folderUrl,
  onUpload,
  isUploading,
  onRefresh
}: FileListProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Google Drive Folder</p>
          {folderUrl && (
            <a
              href={folderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <Link className="h-3 w-3" />
              Open in Google Drive
            </a>
          )}
        </div>

        <div className="flex gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading || isUploading}
              title="Refresh file list"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}

          <label htmlFor="file-upload">
            <Input
              id="file-upload"
              type="file"
              onChange={onUpload}
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
  );
};
