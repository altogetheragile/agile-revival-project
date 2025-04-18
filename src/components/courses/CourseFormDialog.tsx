
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CourseForm from "./CourseForm";
import { Course, CourseFormData } from "@/types/course";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  // Convert Course to CourseFormData for the form
  const convertToFormData = (course: Course): CourseFormData => {
    return {
      ...course,
      id: course.id,
      // Include Google Drive folder information
      googleDriveFolderId: course.googleDriveFolderId,
      googleDriveFolderUrl: course.googleDriveFolderUrl
    };
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {currentCourse ? `Edit Course: ${currentCourse.title}` : "Add New Course"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to {currentCourse ? "update" : "create"} a course.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <CourseForm 
            initialData={currentCourse ? convertToFormData(currentCourse) : undefined}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormDialog;
