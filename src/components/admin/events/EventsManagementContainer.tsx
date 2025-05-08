
import React, { useState } from "react";
import { Event } from "@/types/event";
import { EventsManagementHeader } from "./EventsManagementHeader";
import { EventTable } from "./EventTable";
import { EventLoadingState } from "./EventLoadingState";
import { EventErrorAlert } from "./EventErrorAlert";
import { EventDialogs } from "./EventDialogs";
import { useToast } from "@/components/ui/use-toast";
import { createEventFromTemplate } from "@/services/eventService";
import { useEventManagement } from "@/hooks/useEventManagement";

export const EventsManagementContainer: React.FC = () => {
  const {
    events,
    isLoading,
    loadError,
    searchTerm,
    setSearchTerm,
    isFormOpen,
    setIsFormOpen,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    currentEvent,
    setCurrentEvent,
    deleteEventId,
    setDeleteEventId,
    handleFormSubmit,
    handleDelete,
    handleForceReset
  } = useEventManagement();

  const { toast } = useToast();
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Event | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [mediaLibOpen, setMediaLibOpen] = useState(false);
  const [formData, setFormData] = useState<Event | null>(null);

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = (event: Event) => {
    setDeleteEventId(event.id);
    setIsConfirmDialogOpen(true);
  };

  const handleDuplicateEvent = (event: Event) => {
    // Create a copy of the event without the ID
    const eventCopy: Event = { 
      ...event,
      title: `Copy of ${event.title}`,
      status: 'draft' as "draft"
    };
    // Remove the id from the copy
    delete (eventCopy as any).id;
    setCurrentEvent(null);
    setFormData(eventCopy);
    setIsFormOpen(true);
  };

  const handleScheduleSubmit = async (data: any) => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "No template selected for scheduling",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsScheduling(true);
      const scheduledEvent = await createEventFromTemplate(selectedTemplate.id, data);
      
      if (scheduledEvent) {
        toast({
          title: "Event scheduled",
          description: `${scheduledEvent.title} has been scheduled.`,
        });
        setScheduleDialogOpen(false);
        handleForceReset();
      }
    } catch (error: any) {
      console.error("Error scheduling event:", error);
      toast({
        title: "Error",
        description: error?.message || "There was a problem scheduling the event.",
        variant: "destructive"
      });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleMediaSelect = (url: string, aspectRatio?: string, size?: number, layout?: string) => {
    if (currentEvent) {
      setFormData({
        ...currentEvent,
        imageUrl: url,
        imageAspectRatio: aspectRatio || "16/9",
        imageSize: size || 100,
        imageLayout: layout || "standard"
      });
    }
    setMediaLibOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-6">
      <EventsManagementHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddEvent}
      />
      
      {loadError && (
        <EventErrorAlert 
          error={loadError}
          onRetry={handleForceReset}
        />
      )}
      
      {isLoading ? (
        <EventLoadingState />
      ) : (
        <EventTable 
          events={events}
          onEdit={handleEditEvent} 
          onDelete={handleDeleteConfirm}
          onDuplicate={handleDuplicateEvent}
        />
      )}

      <EventDialogs
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
        isConfirmDialogOpen={isConfirmDialogOpen}
        setIsConfirmDialogOpen={setIsConfirmDialogOpen}
        currentEvent={currentEvent}
        formData={formData}
        setFormData={setFormData}
        handleFormSubmit={handleFormSubmit}
        handleDelete={handleDelete}
        mediaLibOpen={mediaLibOpen}
        setMediaLibOpen={setMediaLibOpen}
        handleMediaSelect={handleMediaSelect}
      />
    </div>
  );
};
