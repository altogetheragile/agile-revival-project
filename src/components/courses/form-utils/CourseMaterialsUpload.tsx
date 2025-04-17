import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface CourseMaterialsUploadProps {
  onFilesChange: (files: File[]) => void;
  files: File[];
}

export const CourseMaterialsUpload: React.FC<CourseMaterialsUploadProps> = ({
  onFilesChange,
  files,
}) => {
  const [fileDescriptions, setFileDescriptions] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const totalSize = Array.from(e.target.files).reduce((acc, file) => acc + file.size, 0);
      const maxSize = 100 * 1024 * 1024; // 100MB total limit
      
      if (totalSize > maxSize) {
        toast({
          title: "Upload Error",
          description: "Total file size exceeds 100MB limit",
          variant: "destructive"
        });
        return;
      }
      
      const newFiles = [...files, ...Array.from(e.target.files)];
      onFilesChange(newFiles);
    }
  }, [files, onFilesChange, toast]);

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  const updateFileDescription = (index: number, description: string) => {
    const fileId = `file-${index}`;
    setFileDescriptions({
      ...fileDescriptions,
      [fileId]: description,
    });
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes("image")) return <FileText className="h-5 w-5 text-green-500" />;
    if (type.includes("video")) return <FileText className="h-5 w-5 text-blue-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file-upload" className="text-base font-medium">
          Course Materials
        </Label>
        <p className="text-sm text-gray-500 mb-2">
          Upload PDFs, videos, or other course materials (max 100MB total)
        </p>
        <div className="flex items-center gap-2">
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="flex-1"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.mov,.zip"
          />
          <Button type="button" size="sm" className="gap-2">
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="border rounded-md p-4 bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Uploaded Materials ({files.length})</h3>
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-3">
              {files.map((file, index) => (
                <div key={index} className="border rounded p-3 bg-white">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file)}
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Textarea
                      placeholder="File description (optional)"
                      className="text-xs h-16"
                      value={fileDescriptions[`file-${index}`] || ""}
                      onChange={(e) =>
                        updateFileDescription(index, e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
