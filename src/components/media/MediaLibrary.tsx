
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMediaLibrary } from "@/hooks/storage/useMediaLibrary";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({ 
  open, 
  onOpenChange,
  onSelect
}) => {
  const { items, loading, upload, bucketExists } = useMediaLibrary();
  const { toast } = useToast();
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelect = (url: string) => {
    onSelect(url);
    onOpenChange(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const { error } = await upload(file);
        if (error) {
          console.error("Error uploading file:", error);
          toast({
            title: "Upload failed",
            description: error.message || "There was a problem uploading your file",
            variant: "destructive",
          });
        } else {
          toast({
            title: "File uploaded",
            description: "Your file has been uploaded successfully",
          });
        }
      } catch (err: any) {
        console.error("Upload error:", err);
        toast({
          title: "Upload failed",
          description: err.message || "There was a problem uploading your file",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        // Clear input value to allow uploading the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>
            Choose an image from the library or upload a new one.
          </DialogDescription>
        </DialogHeader>
        
        {!bucketExists && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Media storage is not properly configured. Please contact your administrator to set up the media bucket in Supabase.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading || !bucketExists}
              className="max-w-xs"
            />
            {uploading && <Loader2 className="animate-spin h-4 w-4" />}
          </div>
          
          <div className="border rounded-md p-2 h-[50vh] overflow-y-auto bg-white">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : !bucketExists ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Media storage is not configured. Create a "media" bucket in your Supabase project.
              </div>
            ) : items.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No images found. Upload one to get started.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-2">
                {items.map((item) => (
                  <div
                    key={item.url}
                    className="relative group cursor-pointer border rounded-md p-2 hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelect(item.url)}
                  >
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <div className="mt-1 text-xs truncate">{item.name}</div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button variant="secondary" size="sm">
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaLibrary;
