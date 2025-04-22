
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MediaUploaderProps {
  uploading: boolean;
  loading: boolean;
  bucketExists: boolean;
  upload: (file: File) => Promise<{ error: Error | null }>;
  onRefresh: () => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  uploading,
  loading,
  bucketExists,
  upload,
  onRefresh
}) => {
  const { toast } = useToast();
  const uploadRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setUploadError(null);
        const { error } = await upload(file);
        
        if (error) {
          console.error("Upload error:", error);
          setUploadError(error.message);
          toast({ 
            title: "Upload failed", 
            description: error.message, 
            variant: "destructive" 
          });
        } else {
          toast({ 
            title: "Upload successful",
            description: "The file was uploaded to the media library."
          });
        }
      } catch (error: any) {
        console.error("Unexpected upload error:", error);
        setUploadError(error.message || "An unexpected error occurred");
        toast({ 
          title: "Upload failed", 
          description: error.message || "An unexpected error occurred", 
          variant: "destructive" 
        });
      } finally {
        if (uploadRef.current) uploadRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-4">
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload Error</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
    
      <div className="flex gap-2">
        <input
          id="admin-media-upload"
          type="file"
          accept="image/*, audio/*, video/*"
          hidden
          ref={uploadRef}
          disabled={uploading || !bucketExists}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          onClick={() => uploadRef.current?.click()}
          disabled={uploading || !bucketExists}
          className="bg-green-500 hover:bg-green-600 text-white flex gap-2 items-center"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Media"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          disabled={loading || uploading}
          className="flex items-center gap-1"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
};
