import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CourseForm from "./CourseForm";
import { Course, CourseFormData } from "@/types/course";
import { ScrollArea } from "@/components/ui/scroll-area";
import MediaLibrary from "@/components/media/MediaLibrary";
import { useToast } from "@/components/ui/use-toast";
import { getGlobalCacheBust } from "@/utils/cacheBusting";

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCourse: Course | null;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  onOpenMediaLibrary?: () => void;
  formData?: Course | null;
  setFormData?: React.Dispatch<React.SetStateAction<Course | null>>;
}

// Convert Course to CourseFormData for the form
const convertToFormData = (course: Course): CourseFormData => {
  console.log("Converting course to form data with image settings:", {
    imageUrl: course.imageUrl,
    imageAspectRatio: course.imageAspectRatio,
    imageSize: course.imageSize,
    imageLayout: course.imageLayout
  });

  return {
    ...course,
    id: course.id,
    // Include Google Drive folder information
    googleDriveFolderId: course.googleDriveFolderId,
    googleDriveFolderUrl: course.googleDriveFolderUrl,
    // Explicitly include image settings
    imageUrl: course.imageUrl || "",
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
  const { toast } = useToast();
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [formData, setFormData] = useState<CourseFormData | null>(
    currentCourse ? convertToFormData(currentCourse) : null
  );
  const [formKey, setFormKey] = useState(Date.now());

  // Update formData when currentCourse changes
  useEffect(() => {
    if (currentCourse) {
      const convertedData = convertToFormData(currentCourse);
      console.log("CourseFormDialog initialized with course image settings:", {
        imageUrl: convertedData.imageUrl,
        imageAspectRatio: convertedData.imageAspectRatio,
        imageSize: convertedData.imageSize,
        imageLayout: convertedData.imageLayout
      });
      setFormData(convertedData);
      // Set a new form key to force re-render with fresh data
      setFormKey(Date.now());
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
    // Ensure URL has a cache busting parameter
    const cacheBust = getGlobalCacheBust();
    const urlWithoutParams = url.split('?')[0];
    const finalUrl = `${urlWithoutParams}?v=${cacheBust}`;
    
    console.log("Course media selected with settings:", {
      url: finalUrl, 
      aspectRatio: aspectRatio || "16/9", 
      size: size || 100, 
      layout: layout || "standard"
    });
    
    // Update the formData with the new image URL and settings
    setFormData(prevData => {
      if (!prevData) {
        // Create new form data if none exists
        const newData: CourseFormData = {
          title: "",
          description: "",
          dates: "",
          location: "",
          instructor: "",
          price: "",
          category: "scrum",
          eventType: "course", // Default event type
          spotsAvailable: 0,
          imageUrl: finalUrl,
          imageAspectRatio: aspectRatio || "16/9",
          imageSize: size || 100,
          imageLayout: layout || "standard"
        };
        return newData;
      }
      
      // Update existing form data
      const updatedFormData = {
        ...prevData,
        imageUrl: finalUrl,
        imageAspectRatio: aspectRatio || "16/9",
        imageSize: size || 100,
        imageLayout: layout || "standard"
      };
      
      console.log("Updated course form data with image settings:", {
        imageUrl: updatedFormData.imageUrl,
        imageAspectRatio: updatedFormData.imageAspectRatio,
        imageSize: updatedFormData.imageSize,
        imageLayout: updatedFormData.imageLayout
      });
      
      return updatedFormData;
    });
    
    // Show confirmation toast
    toast({
      title: "Image settings updated",
      description: "The image and its settings have been applied to the course."
    });
  };
  
  // Handle the form submission to ensure image settings are included
  const handleSubmit = (data: CourseFormData) => {
    console.log("Form submitted with data:", data);
    
    // Make sure we preserve all image settings when submitting
    const submissionData = {
      ...data,
      // Use formData as source of truth for image settings if available
      imageUrl: data.imageUrl || (formData?.imageUrl || ""),
      imageAspectRatio: data.imageAspectRatio || formData?.imageAspectRatio || "16/9",
      imageSize: data.imageSize !== undefined ? data.imageSize : formData?.imageSize || 100,
      imageLayout: data.imageLayout || formData?.imageLayout || "standard",
      // Ensure status is provided with a default
      status: data.status || "draft"
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
              key={formKey}
              initialData={formData || undefined}
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
