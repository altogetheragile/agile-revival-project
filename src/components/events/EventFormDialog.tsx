
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event, EventFormData } from "@/types/event";
import { ScrollArea } from "@/components/ui/scroll-area";
import MediaLibrary from "@/components/media/MediaLibrary";
import { useToast } from "@/components/ui/use-toast";
import { getGlobalCacheBust } from "@/utils/cacheBusting";
import EventForm from "./EventForm";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEvent: Event | null;
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
  onOpenMediaLibrary?: () => void;
  formData?: Event | null;
  setFormData?: React.Dispatch<React.SetStateAction<Event | null>>;
}

// Convert Event to EventFormData for the form
const convertToFormData = (event: Event): EventFormData => {
  return {
    ...event,
    id: event.id,
    // Include Google Drive folder information
    googleDriveFolderId: event.googleDriveFolderId,
    googleDriveFolderUrl: event.googleDriveFolderUrl,
    // Explicitly include image settings
    imageUrl: event.imageUrl || "",
    imageAspectRatio: event.imageAspectRatio || "16/9",
    imageSize: event.imageSize || 100,
    imageLayout: event.imageLayout || "standard"
  };
};

const EventFormDialog: React.FC<EventFormDialogProps> = ({
  open,
  onOpenChange,
  currentEvent,
  onSubmit,
  onCancel,
  onOpenMediaLibrary,
  formData,
  setFormData,
}) => {
  const { toast } = useToast();
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [localFormData, setLocalFormData] = useState<EventFormData | null>(
    currentEvent ? convertToFormData(currentEvent) : formData || null
  );
  const [formKey, setFormKey] = useState(Date.now());

  // Update formData when currentEvent or external formData changes
  useEffect(() => {
    if (currentEvent) {
      const convertedData = convertToFormData(currentEvent);
      setLocalFormData(convertedData);
      // Set a new form key to force re-render with fresh data
      setFormKey(Date.now());
    } else if (formData) {
      setLocalFormData(formData);
      setFormKey(Date.now());
    } else {
      setLocalFormData(null);
    }
  }, [currentEvent, formData]);
  
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
    
    // Update the formData with the new image URL and settings
    const updatedFormData = localFormData ? {
      ...localFormData,
      imageUrl: finalUrl,
      imageAspectRatio: aspectRatio || "16/9",
      imageSize: size || 100,
      imageLayout: layout || "standard"
    } : {
      title: "",
      description: "",
      dates: "",
      location: "",
      instructor: "",
      price: "",
      category: "",
      spotsAvailable: 0,
      imageUrl: finalUrl,
      imageAspectRatio: aspectRatio || "16/9",
      imageSize: size || 100,
      imageLayout: layout || "standard"
    };
    
    setLocalFormData(updatedFormData);
    if (setFormData) {
      setFormData(updatedFormData as Event);
    }
    
    // Show confirmation toast
    toast({
      title: "Image settings updated",
      description: "The image and its settings have been applied to the event."
    });
  };
  
  // Handle the form submission to ensure image settings are included
  const handleSubmit = (data: EventFormData) => {
    // Make sure we preserve all image settings when submitting
    const submissionData = {
      ...data,
      // Use formData as source of truth for image settings if available
      imageUrl: data.imageUrl || (localFormData?.imageUrl || ""),
      imageAspectRatio: data.imageAspectRatio || localFormData?.imageAspectRatio || "16/9",
      imageSize: data.imageSize !== undefined ? data.imageSize : localFormData?.imageSize || 100,
      imageLayout: data.imageLayout || localFormData?.imageLayout || "standard"
    };
    
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
                {currentEvent ? `Edit Event: ${currentEvent.title}` : "Add New Event"}
              </DialogTitle>
              <DialogDescription>
                Fill in the details below to {currentEvent ? "update" : "create"} an event.
              </DialogDescription>
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <EventForm 
              key={formKey}
              initialData={localFormData || undefined}
              onSubmit={handleSubmit}
              onCancel={onCancel}
              onOpenMediaLibrary={() => setIsMediaLibraryOpen(true)}
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

export default EventFormDialog;
