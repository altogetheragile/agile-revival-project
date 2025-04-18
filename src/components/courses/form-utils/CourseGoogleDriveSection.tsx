
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { GoogleDriveFolder } from "@/components/google/GoogleDriveFolder";
import { useFormContext } from "react-hook-form";
import { CourseFormData } from "@/types/course";

interface CourseGoogleDriveSectionProps {
  courseId?: string;
}

export const CourseGoogleDriveSection: React.FC<CourseGoogleDriveSectionProps> = ({ courseId }) => {
  const { watch, setValue } = useFormContext<CourseFormData>();
  const courseTitle = watch("title");
  const googleDriveFolderId = watch("googleDriveFolderId");
  const googleDriveFolderUrl = watch("googleDriveFolderUrl");
  
  const handleFolderCreated = (folderId: string, folderUrl: string) => {
    setValue("googleDriveFolderId", folderId);
    setValue("googleDriveFolderUrl", folderUrl);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Course Materials</h3>
      <Separator />
      
      <GoogleDriveFolder 
        courseId={courseId || "new-course"}
        courseTitle={courseTitle || "New Course"}
        folderId={googleDriveFolderId}
        folderUrl={googleDriveFolderUrl}
        onFolderCreated={handleFolderCreated}
      />
    </div>
  );
};

