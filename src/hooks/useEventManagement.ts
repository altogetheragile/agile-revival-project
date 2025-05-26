import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Event, EventFormData } from "@/types/event";
import { Course, CourseFormData } from "@/types/course";
import { getScheduledEvents, createEvent, updateEvent, deleteEvent, getEventById } from "@/services/eventService";
import { toast } from "sonner";
import { useConnection } from "@/contexts/ConnectionContext";

export const useEventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadRetries, setLoadRetries] = useState(0);
  const { toast: uiToast } = useToast();
  const { connectionState, checkConnection } = useConnection();
  
  // Maximum number of retry attempts
  const MAX_RETRIES = 3;

  // Helper function to convert Course to Event
  const convertCoursesToEvents = (courses: Course[]): Event[] => {
    return courses.map(course => ({
      ...course,
      status: course.status || "draft", // Ensure status is not undefined
      eventType: course.eventType || "course" // Ensure eventType is not undefined
    } as Event));
  };

  const loadEvents = useCallback(async (showToast = true) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      
      // Check connection status first if we've had previous errors
      if (loadRetries > 0 && !connectionState.isConnected) {
        await checkConnection();
        if (!connectionState.isConnected) {
          setLoadError("Database connection issue. Please check your internet connection.");
          setIsLoading(false);
          return;
        }
      }
      
      console.log("Loading scheduled events only (excluding templates)...");
      // FIXED: Use getScheduledEvents instead of getAllEvents to exclude templates
      const scheduledCourses = await getScheduledEvents();
      
      if (!scheduledCourses || scheduledCourses.length === 0) {
        console.log("No scheduled events loaded or empty array returned");
      } else {
        console.log(`Loaded ${scheduledCourses.length} scheduled events successfully (templates excluded)`);
        // Reset retry counter on successful load
        if (loadRetries > 0) {
          setLoadRetries(0);
          if (showToast) {
            toast.success("Connection restored", {
              description: "Successfully loaded events data."
            });
          }
        }
      }
      
      // Convert Course[] to Event[]
      const convertedEvents = convertCoursesToEvents(scheduledCourses);
      setEvents(convertedEvents);
    } catch (error: any) {
      console.error("Error loading scheduled events:", error);
      setLoadError(error?.message || "Failed to load events");
      
      // Check for specific error types
      if (error.message?.includes('infinite recursion detected')) {
        setLoadError("Database permission configuration issue detected. Please try again in a few moments.");
        toast.error("Permission configuration issue", {
          description: "The system is experiencing a temporary permission issue."
        });
      } else if (error.message?.includes('Failed to fetch') || 
                 error.message?.includes('Network error') ||
                 error.message?.includes('timeout') ||
                 error.message?.includes('abort')) {
        // Increment retry counter for connection issues
        setLoadRetries(prev => prev + 1);
        
        if (loadRetries < MAX_RETRIES) {
          // Schedule a retry with exponential backoff
          const delay = Math.min(1000 * Math.pow(2, loadRetries), 10000);
          toast.error("Connection issue", {
            description: `Attempting to reconnect in ${delay/1000} seconds...`
          });
          
          setTimeout(() => {
            loadEvents(false); // Don't show toast on auto-retry
          }, delay);
        } else {
          toast.error("Connection failed", {
            description: "Could not connect after multiple attempts. Please check your network."
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadRetries, connectionState, checkConnection, uiToast]);

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

  // Helper function to convert EventFormData to CourseFormData
  const convertEventToCourseFormData = (eventData: EventFormData): CourseFormData => {
    return {
      ...eventData,
      eventType: eventData.eventType || "event", // Default to "event" type
      status: eventData.status || "draft" // Ensure status is not undefined
    } as CourseFormData;
  };

  const handleFormSubmit = async (data: EventFormData) => {
    try {
      console.log("Submitting event form data:", data);

      // Check connection first
      if (!connectionState.isConnected) {
        await checkConnection();
        if (!connectionState.isConnected) {
          toast.error("Unable to save", {
            description: "Database connection issue. Please check your internet connection."
          });
          return;
        }
      }
      
      // Convert EventFormData to CourseFormData
      const courseData = convertEventToCourseFormData(data);
      
      if (currentEvent) {
        console.log("Updating existing event:", currentEvent.id);
        const updated = await updateEvent(currentEvent.id, courseData);
        
        if (updated) {
          console.log("Event updated successfully");
          await loadEvents();
          // Only update currentEvent if we have a valid Event object, not just a boolean success value
          const updatedEvent = await getEventById(currentEvent.id);
          if (updatedEvent) {
            // Convert Course to Event
            setCurrentEvent(convertCoursesToEvents([updatedEvent])[0]);
          }
          uiToast({
            title: "Event updated",
            description: `"${data.title}" has been updated successfully.`
          });
          setIsFormOpen(false);
        }
      } else {
        console.log("Creating new event");
        const created = await createEvent(courseData);
        
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
      } else if (error.message?.includes('Failed to fetch') || 
                 error.message?.includes('Network error') ||
                 error.message?.includes('timeout') ||
                 error.message?.includes('abort')) {
        errorMessage = "Network connection issue. Please check your internet connection and try again.";
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
        // Check connection first
        if (!connectionState.isConnected) {
          await checkConnection();
          if (!connectionState.isConnected) {
            toast.error("Unable to delete", {
              description: "Database connection issue. Please check your internet connection."
            });
            return;
          }
        }
        
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
        } else if (error.message?.includes('Failed to fetch') || 
                  error.message?.includes('Network error') ||
                  error.message?.includes('timeout') ||
                  error.message?.includes('abort')) {
          errorMessage = "Network connection issue. Please check your internet connection and try again.";
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
