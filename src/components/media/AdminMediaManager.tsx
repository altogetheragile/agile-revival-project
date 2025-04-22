
import React, { useState, useRef } from "react";
import { useMediaLibrary } from "@/hooks/storage/useMediaLibrary";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AdminMediaManager: React.FC = () => {
  const { items, loading, upload, fetchMedia } = useMediaLibrary();
  const { toast } = useToast();
  const uploadRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      const { error } = await upload(file);
      setUploading(false);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Upload successful" });
      }
      uploadRef.current!.value = "";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex gap-2">
        <input
          id="admin-media-upload"
          type="file"
          accept="image/*"
          hidden
          ref={uploadRef}
          disabled={uploading}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => uploadRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={fetchMedia}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Media Library</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-80 overflow-auto p-2 border rounded bg-white">
          {loading && <div className="col-span-full text-center">Loading...</div>}
          {!loading && items.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground">No images found.</div>
          )}
          {items.map((item) => (
            <div key={item.url} className="flex flex-col items-center gap-1">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-28 object-contain border rounded bg-gray-50"
                title={item.name}
              />
              <span className="text-xs truncate w-full">{item.name}</span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-agile-purple text-xs underline">
                View
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMediaManager;
