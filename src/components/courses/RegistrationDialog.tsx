
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Course } from "@/types/course";
import RegistrationForm from "./RegistrationForm";
import GroupRegistrationForm from "./GroupRegistrationForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, User } from "lucide-react";

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
  const [registrationType, setRegistrationType] = useState<"individual" | "group">("individual");
  
  if (!course) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for {course.title}</DialogTitle>
          <DialogDescription>
            Fill in your details below to reserve {registrationType === "individual" ? "your spot" : "spots for your group"} for this course on {course.dates}.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={registrationType} onValueChange={(value) => setRegistrationType(value as "individual" | "group")}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <User size={16} />
              Individual
            </TabsTrigger>
            <TabsTrigger value="group" className="flex items-center gap-2">
              <Users size={16} />
              Group
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual">
            <RegistrationForm 
              course={course} 
              onComplete={() => onOpenChange(false)} 
            />
          </TabsContent>
          
          <TabsContent value="group">
            <GroupRegistrationForm 
              course={course} 
              onComplete={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
        <p className="text-xs text-gray-500 mt-2">* All fields marked with an asterisk are required.</p>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;
