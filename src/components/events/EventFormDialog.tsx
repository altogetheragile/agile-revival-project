
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
  formData?: Event | null;
  setFormData?: React.Dispatch<React.SetStateAction<Event | null>>;
  onOpenMediaLibrary?: () => void;
}

// Convert Event to EventFormData for the form
const convertToFormData = (event: Event): EventFormData => {
  console.log("Converting event to form data with ID:", event.id);
  return {
    ...event,
    id: event.id, // Explicitly preserve ID
    // Include Google Drive folder information if available
    googleDriveFolderId: event.googleDriveFolderId || "",
    googleDriveFolderUrl: event.googleDriveFolderUrl || "",
    // Explicitly include image settings with defaults if not provided
    imageUrl: event.imageUrl || "",
    imageAspectRatio: event.imageAspectRatio || "16/9",
    imageSize: event.imageSize || 100,
    imageLayout: event.imageLayout || "standard",
    // Ensure eventType is included
    eventType: event.eventType || "event"
  };
};

const EventFormDialog: React.FC<EventFormDialogProps> = ({
  open,
  onOpenChange,
  currentEvent,
  onSubmit,
  onCancel,
  formData,
  setFormData,
  onOpenMediaLibrary,
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
      console.log("EventFormDialog - setting form data from currentEvent with ID:", currentEvent.id);
      const convertedData = convertToFormData(currentEvent);
      setLocalFormData(convertedData);
      setFormKey(Date.now()); // Force re-render with fresh data
    } else if (formData) {
      console.log("EventFormDialog - setting form data from formData:", formData);
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
      eventType: "event", // Add default eventType
      spotsAvailable: 0,
      status: "draft" as const,
      imageUrl: finalUrl,
      imageAspectRatio: aspectRatio || "16/9",
      imageSize: size || 100,
      imageLayout: layout || "standard"
    };
    
    setLocalFormData(updatedFormData);
    if (setFormData) {
      setFormData(updatedFormData as Event);
    }
    
    toast({
      title: "Image settings updated",
      description: "The image and its settings have been applied to the event."
    });
  };
  
  // Handle form submission ensuring image settings are included
  const handleSubmit = (data: EventFormData) => {
    // Preserve ID when submitting
    if (currentEvent) {
      console.log("Submitting event update with ID:", currentEvent.id);
      data.id = currentEvent.id; // Explicitly set ID
    } else if (localFormData?.id) {
      console.log("Preserving existing form data ID:", localFormData.id);
      data.id = localFormData.id;
    }
    
    // Preserve all image settings when submitting
    const submissionData = {
      ...data,
      // Use formData as source of truth for image settings
      imageUrl: data.imageUrl || (localFormData?.imageUrl || ""),
      imageAspectRatio: data.imageAspectRatio || localFormData?.imageAspectRatio || "16/9",
      imageSize: data.imageSize !== undefined ? data.imageSize : localFormData?.imageSize || 100,
      imageLayout: data.imageLayout || localFormData?.imageLayout || "standard",
      // Ensure eventType is included
      eventType: data.eventType || localFormData?.eventType || "event"
    };
    
    console.log("Final event form submission data with ID:", submissionData.id);
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
            {/* Debug ID display for development */}
            {(currentEvent || localFormData?.id) && (
              <div className="text-xs text-muted-foreground mb-2 p-1 bg-muted rounded">
                Editing event ID: {currentEvent?.id || localFormData?.id}
              </div>
            )}
            
            <EventForm 
              key={formKey}
              initialData={localFormData || undefined}
              onSubmit={handleSubmit}
              onCancel={onCancel}
              onOpenMediaLibrary={onOpenMediaLibrary || (() => setIsMediaLibraryOpen(true))}
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
