
import React, { useState } from "react";
import { useMediaLibrary } from "@/hooks/storage/useMediaLibrary";
import { useToast } from "@/components/ui/use-toast";
import { MediaStorageAlert } from "./admin/MediaStorageAlert";
import { MediaUploader } from "./admin/MediaUploader";
import { MediaGrid } from "./admin/MediaGrid";

const AdminMediaManager: React.FC = () => {
  const { items, loading, upload, fetchMedia, bucketExists, error } = useMediaLibrary();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleRefresh = () => {
    fetchMedia();
    toast({
      title: "Refreshing media library",
      description: "Checking for new media files..."
    });
  };

  const copyUrlToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "File URL has been copied to clipboard"
    });
  };

  // Wrapper function to match expected type signature
  const handleUpload = async (file: File): Promise<{ error: Error | null }> => {
    setUploading(true);
    try {
      const result = await upload(file);
      
      // If there's an error in the result, return it with the expected format
      if (result.error) {
        return { error: result.error instanceof Error ? result.error : new Error(String(result.error)) };
      }
      
      // If successful, return null error
      return { error: null };
    } catch (err) {
      // Convert any caught error to the expected format
      return { error: err instanceof Error ? err : new Error(String(err)) };
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <MediaStorageAlert error={error} bucketExists={bucketExists} />
      
      <MediaUploader
        uploading={uploading}
        loading={loading}
        bucketExists={bucketExists}
        upload={handleUpload}
        onRefresh={handleRefresh}
      />
      
      <MediaGrid
        items={items}
        loading={loading}
        bucketExists={bucketExists}
        onCopyUrl={copyUrlToClipboard}
      />
    </div>
  );
};

export default AdminMediaManager;
