
import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMediaLibrary, MediaItem } from "@/hooks/storage/useMediaLibrary";
import { useToast } from "@/components/ui/use-toast";

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              id="media-upload-input"
              type="file"
              accept="image/*"
              hidden
              ref={uploadRef}
              disabled={uploading}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              onClick={() => uploadRef.current?.click()}
              disabled={uploading}
              variant="secondary"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={fetchMedia}
              disabled={loading}
              variant="outline"
            >
              Refresh
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-72 overflow-auto">
            {loading && <div className="col-span-3 text-center">Loading...</div>}
            {!loading && items.length === 0 && (
              <div className="col-span-3 text-center text-muted-foreground">
                No images found.
              </div>
            )}
            {items.map((item, idx) => (
              <button
                type="button"
                key={item.url + idx}
                onClick={() => {
                  onSelect(item.url);
                  onOpenChange(false);
                }}
                className="border border-gray-300 rounded hover:ring-2 ring-agile-purple transition p-1 bg-white"
                title={item.name}
              >
                <img src={item.url} alt={item.name} className="w-full h-24 object-contain" />
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;
