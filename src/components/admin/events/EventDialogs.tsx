
import React from "react";
import { Event } from "@/types/event";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import EventFormDialog from "@/components/events/EventFormDialog";

interface EventDialogsProps {
  isFormOpen: boolean;
  setIsFormOpen: (open: boolean) => void;
  isConfirmDialogOpen: boolean;
  setIsConfirmDialogOpen: (open: boolean) => void;
  currentEvent: Event | null;
  formData: Event | null;
  setFormData: React.Dispatch<React.SetStateAction<Event | null>>;
  handleFormSubmit: (data: any) => void;
  handleDelete: () => void;
  mediaLibOpen: boolean;
  setMediaLibOpen: (open: boolean) => void;
  handleMediaSelect: (url: string, aspectRatio?: string, size?: number, layout?: string) => void;
}

export const EventDialogs: React.FC<EventDialogsProps> = ({
  isFormOpen,
  setIsFormOpen,
  isConfirmDialogOpen,
  setIsConfirmDialogOpen,
  currentEvent,
  formData,
  setFormData,
  handleFormSubmit,
  handleDelete,
  mediaLibOpen,
  setMediaLibOpen,
  handleMediaSelect,
}) => {
  return (
    <>
      {/* Event Form Dialog */}
      <EventFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        currentEvent={currentEvent}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
        onOpenMediaLibrary={() => setMediaLibOpen(true)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
