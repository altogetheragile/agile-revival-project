
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CourseForm from "./CourseForm";
import { Course, CourseFormData } from "@/types/course";
import { ScrollArea } from "@/components/ui/scroll-area";
import MediaLibrary from "@/components/media/MediaLibrary";

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCourse: Course | null;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
}

// Convert Course to CourseFormData for the form
const convertToFormData = (course: Course): CourseFormData => {
  return {
    ...course,
    id: course.id,
    // Include Google Drive folder information
    googleDriveFolderId: course.googleDriveFolderId,
    googleDriveFolderUrl: course.googleDriveFolderUrl,
    // Explicitly include image settings
    imageUrl: course.imageUrl,
    imageAspectRatio: course.imageAspectRatio || "16/9",
    imageSize: course.imageSize || 100,
    imageLayout: course.imageLayout || "standard"
  };
};

const CourseFormDialog: React.FC<CourseFormDialogProps> = ({
  open,
  onOpenChange,
  currentCourse,
  onSubmit,
  onCancel,
}) => {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [formData, setFormData] = useState<CourseFormData | null>(
    currentCourse ? convertToFormData(currentCourse) : null
  );

  // Update formData when currentCourse changes
  useEffect(() => {
    if (currentCourse) {
      setFormData(convertToFormData(currentCourse));
    } else {
      setFormData(null);
    }
  }, [currentCourse]);
  
  const handleMediaSelect = (
    url: string, 
    aspectRatio?: string, 
    size?: number, 
    layout?: string
  ) => {
    console.log("Media selected:", url, "with aspect ratio:", aspectRatio, "size:", size, "layout:", layout);
    if (formData) {
      // Update the formData with the new image URL and settings
      const updatedFormData = {
        ...formData,
        imageUrl: url,
        imageAspectRatio: aspectRatio || "16/9",
        imageSize: size || 100,
        imageLayout: layout || "standard"
      };
      setFormData(updatedFormData);
      console.log("Updated form data:", updatedFormData);
    }
  };
  
  // Handle the form submission to ensure image settings are included
  const handleSubmit = (data: CourseFormData) => {
    // Make sure we preserve all image settings when submitting
    const submissionData = {
      ...data,
      imageUrl: data.imageUrl || formData?.imageUrl,
      imageAspectRatio: data.imageAspectRatio || formData?.imageAspectRatio || "16/9",
      imageSize: data.imageSize !== undefined ? data.imageSize : formData?.imageSize || 100,
      imageLayout: data.imageLayout || formData?.imageLayout || "standard"
    };
    
    console.log("Submitting course with image settings:", {
      imageUrl: submissionData.imageUrl,
      imageAspectRatio: submissionData.imageAspectRatio,
      imageSize: submissionData.imageSize,
      imageLayout: submissionData.imageLayout
    });
    
    // Call the original onSubmit with our complete data
    onSubmit(submissionData);
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
              onSubmit={handleSubmit}
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
