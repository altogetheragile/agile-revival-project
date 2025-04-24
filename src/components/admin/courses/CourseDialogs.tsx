
import { Course } from "@/types/course";
import CourseFormDialog from "@/components/courses/CourseFormDialog";
import { DeleteConfirmationDialog } from "../users/DeleteConfirmationDialog";
import ScheduleCourseDialog from "@/components/courses/ScheduleCourseDialog";
import MediaLibrary from "@/components/media/MediaLibrary";

interface CourseDialogsProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  isConfirmDialogOpen: boolean;
  setIsConfirmDialogOpen: (open: boolean) => void;
  scheduleDialogOpen: boolean;
  setScheduleDialogOpen: (open: boolean) => void;
  mediaLibOpen: boolean;
  setMediaLibOpen: (open: boolean) => void;
  currentCourse: Course | null;
  selectedTemplate: Course | null;
  formData: Course | null;
  setFormData: (data: Course | null) => void;
  handleFormSubmit: (data: any) => Promise<void>;
  handleDelete: () => Promise<void>;
  handleScheduleSubmit: (data: any) => Promise<void>;
  handleMediaSelect: (url: string, aspectRatio?: string, size?: number, layout?: string) => void;
  isScheduling: boolean;
}

export const CourseDialogs = ({
  isFormOpen,
  setIsFormOpen,
  isConfirmDialogOpen,
  setIsConfirmDialogOpen,
  scheduleDialogOpen,
  setScheduleDialogOpen,
  mediaLibOpen,
  setMediaLibOpen,
  currentCourse,
  selectedTemplate,
  formData,
  setFormData,
  handleFormSubmit,
  handleDelete,
  handleScheduleSubmit,
  handleMediaSelect,
  isScheduling
}: CourseDialogsProps) => {
  return (
    <>
      <CourseFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentCourse={currentCourse}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
        onOpenMediaLibrary={() => setMediaLibOpen(true)}
        formData={formData}
        setFormData={setFormData}
      />

      <DeleteConfirmationDialog 
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={handleDelete}
      />

      <ScheduleCourseDialog
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        template={selectedTemplate}
        onSubmit={handleScheduleSubmit}
        onCancel={() => setScheduleDialogOpen(false)}
        onOpenMediaLibrary={() => setMediaLibOpen(true)}
        isSubmitting={isScheduling}
      />

      <MediaLibrary
        open={mediaLibOpen}
        onOpenChange={setMediaLibOpen}
        onSelect={handleMediaSelect}
      />
    </>
  );
};
