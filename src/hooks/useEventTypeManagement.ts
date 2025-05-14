
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";

// Default event types if none are found in settings
const DEFAULT_EVENT_TYPES = [
  { value: "workshop", label: "Workshop" },
  { value: "course", label: "Course" },
  { value: "webinar", label: "Webinar" },
  { value: "conference", label: "Conference" },
  { value: "meetup", label: "Meetup" },
  { value: "training", label: "Training" },
  { value: "other", label: "Other" }
];

export const useEventTypeManagement = () => {
  const [eventTypes, setEventTypes] = useState<{ value: string; label: string }[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newEventType, setNewEventType] = useState("");
  const { toast } = useToast();
  const { settings, updateSettings } = useSiteSettings();

  // Initialize event types from site settings if available, otherwise use defaults
  useEffect(() => {
    const initEventTypes = () => {
      if (settings.eventTypes && Array.isArray(settings.eventTypes)) {
        setEventTypes(
          settings.eventTypes.map(type => ({
            value: type.value,
            label: type.label
          }))
        );
      } else {
        // Fallback to default event types
        setEventTypes(DEFAULT_EVENT_TYPES);
      }
    };
    
    initEventTypes();
  }, [settings]);

  const saveEventTypesToSettings = async (updatedEventTypes: { value: string; label: string }[]) => {
    try {
      // Save to site settings
      await updateSettings('eventTypes', updatedEventTypes);
      
      console.log("Event types saved successfully:", updatedEventTypes);
      return true;
    } catch (error) {
      console.error("Error saving event types:", error);
      return false;
    }
  };

  const handleAddEventType = async (onAdd: (value: string) => void) => {
    if (
      newEventType.trim() &&
      !eventTypes.some(opt => opt.value.toLowerCase() === newEventType.trim().toLowerCase())
    ) {
      const newType = { value: newEventType.trim().toLowerCase(), label: newEventType.trim() };
      const updatedEventTypes = [...eventTypes, newType];
      
      const success = await saveEventTypesToSettings(updatedEventTypes);
      
      if (success) {
        setEventTypes(updatedEventTypes);
        onAdd(newType.value);
        setAddMode(false);
        setNewEventType("");
        
        toast({
          title: "Event type added",
          description: `"${newType.label}" has been added to event types.`
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem adding the event type.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteEventType = async (value: string, onDelete: (value: string) => void) => {
    try {
      console.log("Deleting event type:", value);
      const updatedEventTypes = eventTypes.filter(type => type.value !== value);
      const deletedEventType = eventTypes.find(type => type.value === value);
      
      const success = await saveEventTypesToSettings(updatedEventTypes);
      
      if (success) {
        setEventTypes(updatedEventTypes); // Update local state
        onDelete(value);
        
        toast({
          title: "Event type deleted",
          description: `"${deletedEventType?.label || value}" has been removed from event types.`
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem deleting the event type.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting event type:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting the event type.",
        variant: "destructive"
      });
    }
  };

  return {
    eventTypes,
    addMode,
    setAddMode,
    newEventType,
    setNewEventType,
    handleAddEventType,
    handleDeleteEventType
  };
};
