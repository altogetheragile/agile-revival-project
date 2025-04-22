
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CourseForm from "./CourseForm";
import { Course, CourseFormData } from "@/types/course";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaLibrary } from "@/components/media/MediaLibrary";

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCourse: Course | null;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
  open,
  onOpenChange,
  currentCourse,
  onSubmit,
  onCancel,
}) => {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [formData, setFormData] = useState<CourseFormData | null>(null);

  // Convert Course to CourseFormData for the form
  const convertToFormData = (course: Course): CourseFormData => {
    return {
      ...course,
      id: course.id,
      // Include Google Drive folder information
      googleDriveFolderId: course.googleDriveFolderId,
      googleDriveFolderUrl: course.googleDriveFolderUrl,
      imageUrl: course.imageUrl
    };
  };
  
  const handleMediaSelect = (url: string) => {
    if (formData) {
      setFormData({
        ...formData,
        imageUrl: url
      });
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <div>
              <DialogTitle>
                {currentCourse ? `Edit Course: ${currentCourse.title}` : "Add New Course"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to {currentCourse ? "update" : "create"} a course.
              </DialogDescription>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <CourseForm 
              initialData={currentCourse ? convertToFormData(currentCourse) : undefined}
              onSubmit={onSubmit}
              onCancel={onCancel}
              stayOpenOnSubmit={true}
              onOpenMediaLibrary={() => setIsMediaLibraryOpen(true)}
              formData={formData}
              setFormData={setFormData}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <MediaLibrary 
        open={isMediaLibraryOpen}
        onOpenChange={setIsMediaLibraryOpen}
        onSelect={handleMediaSelect}
      />
    </>
  );
};

export default CourseFormDialog;
