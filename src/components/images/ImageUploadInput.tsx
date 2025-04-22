
import React, { useState } from "react";
import { useImageUploader } from "@/hooks/storage/useImageUploader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadInputProps {
  onUpload: (url: string, bucketType: "public" | "private") => void;
  label?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  onUpload,
  label = "Upload Image",
}) => {
  const [bucketType, setBucketType] = useState<"public" | "private">("public");
  const [file, setFile] = useState<File | null>(null);
  const { isUploading, uploadImage } = useImageUploader();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }
    const result = await uploadImage(file, bucketType);
    if (result.error) {
      toast({
        title: "Upload failed",
        description: result.error,
        variant: "destructive",
      });
    } else if (result.url) {
      toast({
        title: "Upload successful",
        description: "Image has been uploaded successfully.",
      });
      onUpload(result.url, bucketType);
      setFile(null);
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <Label>{label}</Label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <div className="flex items-center gap-4">
        <Label>
          <input
            type="radio"
            name="bucketType"
            value="public"
            checked={bucketType === "public"}
            onChange={() => setBucketType("public")}
            disabled={isUploading}
            className="mr-1"
          />
          Public
        </Label>
        <Label>
          <input
            type="radio"
            name="bucketType"
            value="private"
            checked={bucketType === "private"}
            onChange={() => setBucketType("private")}
            disabled={isUploading}
            className="mr-1"
          />
          Private
        </Label>
      </div>
      <Button
        type="button"
        onClick={handleUpload}
        disabled={!file || isUploading}
      >
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
};

export default ImageUploadInput;
