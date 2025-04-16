
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Course } from "@/types/course";
import RegistrationForm from "./RegistrationForm";

interface RegistrationDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({
  course,
  open,
  onOpenChange,
}) => {
  if (!course) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register for {course.title}</DialogTitle>
          <DialogDescription>
            Fill in your details below to reserve your spot for this course on {course.dates}.
          </DialogDescription>
        </DialogHeader>
        <RegistrationForm 
          course={course} 
          onComplete={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;
