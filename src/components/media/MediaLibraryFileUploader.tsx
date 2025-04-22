
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, RefreshCw } from "lucide-react";

interface MediaLibraryFileUploaderProps {
  uploading: boolean;
  loading: boolean;
  bucketExists: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
  onRefresh: () => void;
}

export const MediaLibraryFileUploader: React.FC<MediaLibraryFileUploaderProps> = ({
  uploading, loading, bucketExists, fileInputRef,
  onFileChange, onUploadClick, onRefresh
}) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 flex gap-2">
      <Button
        onClick={onUploadClick}
        disabled={uploading || !bucketExists}
        className="bg-green-500 hover:bg-green-600 text-white flex gap-2 items-center"
        type="button"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading..." : "Upload File"}
      </Button>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*, audio/*, video/*"
        onChange={onFileChange}
        disabled={uploading || !bucketExists}
        className="hidden"
      />
      {uploading && <Loader2 className="animate-spin h-4 w-4" />}
    </div>
    <Button 
      onClick={onRefresh} 
      variant="outline" 
      size="sm"
      disabled={loading}
      className="ml-auto"
    >
      <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> 
      {loading ? "Refreshing..." : "Refresh"}
    </Button>
  </div>
);

