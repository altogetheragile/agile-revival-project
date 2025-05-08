
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Event, EventFormData } from "@/types/event";
import { getAllEvents, createEvent, updateEvent, deleteEvent, getEventById } from "@/services/eventService";
import { toast } from "sonner";

export const useEventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      
      console.log("Loading all events...");
      const allEvents = await getAllEvents();
      
      if (!allEvents || allEvents.length === 0) {
        console.log("No events loaded or empty array returned");
      } else {
        console.log(`Loaded ${allEvents.length} events successfully`);
      }
      
      setEvents(allEvents);
    } catch (error: any) {
      console.error("Error loading events:", error);
      setLoadError(error?.message || "Failed to load events");
      
      // Check for specific error types
      if (error.message?.includes('infinite recursion detected')) {
        setLoadError("Database permission configuration issue detected. Please try again in a few moments.");
        toast.error("Permission configuration issue", {
          description: "The system is experiencing a temporary permission issue."
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = events.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.category.toLowerCase().includes(searchLower) ||
      (event.instructor && event.instructor.toLowerCase().includes(searchLower)) ||
      (event.location && event.location.toLowerCase().includes(searchLower))
    );
  });

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      console.log("Submitting event form data:", data);

      if (currentEvent) {
        console.log("Updating existing event:", currentEvent.id);
        const updated = await updateEvent(currentEvent.id, data);
        
        if (updated) {
          console.log("Event updated successfully");
          await loadEvents();
          // Only update currentEvent if we have a valid Event object, not just a boolean success value
          const updatedEvent = await getEventById(currentEvent.id);
          if (updatedEvent) {
            setCurrentEvent(updatedEvent);
          }
          uiToast({
            title: "Event updated",
            description: `"${data.title}" has been updated successfully.`
          });
          setIsFormOpen(false);
        }
      } else {
        console.log("Creating new event");
        const created = await createEvent(data);
        
        if (created) {
          console.log("Event created successfully");
          await loadEvents();
          uiToast({
            title: "Event created",
            description: `"${data.title}" has been created successfully.`
          });
          setIsFormOpen(false);
        }
      }
    } catch (error: any) {
      console.error("Error handling event submission:", error);
      
      // Enhanced error handling
      let errorMessage = "There was a problem saving the event.";
      if (error.message?.includes('infinite recursion detected')) {
        errorMessage = "Permission configuration issue detected. Please try again in a few moments.";
      } else if (error.message?.includes('violates row-level security policy')) {
        errorMessage = "You don't have permission to perform this action.";
      }
      
      uiToast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (deleteEventId) {
      try {
        const success = await deleteEvent(deleteEventId);
        if (success) {
          await loadEvents();
          uiToast({
            title: "Event deleted",
            description: "The event has been removed successfully."
          });
        }
      } catch (error: any) {
        console.error("Error deleting event:", error);
        
        // Enhanced error handling
        let errorMessage = "There was a problem deleting the event.";
        if (error.message?.includes('infinite recursion detected')) {
          errorMessage = "Permission configuration issue detected. Please try again in a few moments.";
        } else if (error.message?.includes('violates row-level security policy')) {
          errorMessage = "You don't have permission to perform this action.";
        }
        
        uiToast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
      } finally {
        setIsConfirmDialogOpen(false);
        setDeleteEventId(null);
      }
    }
  };

  const handleForceReset = () => {
    toast.success("Cache reset", {
      description: "The event data has been refreshed from the database."
    });
    
    loadEvents();
  };

  return {
    events: filteredEvents,
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
    isLoading,
    loadError,
    handleFormSubmit,
    handleDelete,
    handleForceReset,
    refreshEvents: loadEvents
  };
};
