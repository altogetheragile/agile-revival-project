
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { EventType, getEventTypes, createEventType, deleteEventType } from "@/services/event/eventTypeService";

// Default event types if none are found in database
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

  // Initialize event types from database
  useEffect(() => {
    const initEventTypes = async () => {
      try {
        const types = await getEventTypes();
        
        if (types && types.length > 0) {
          setEventTypes(
            types.map(type => ({
              value: type.value,
              label: type.label
            }))
          );
        } else {
          // Fallback to default event types if none found in database
          setEventTypes(DEFAULT_EVENT_TYPES);
        }
      } catch (error) {
        console.error("Error initializing event types:", error);
        // Fallback to defaults on error
        setEventTypes(DEFAULT_EVENT_TYPES);
      }
    };
    
    initEventTypes();
  }, []);

  const handleAddEventType = async (onAdd: (value: string) => void) => {
    if (
      newEventType.trim() &&
      !eventTypes.some(opt => opt.value.toLowerCase() === newEventType.trim().toLowerCase())
    ) {
      const value = newEventType.trim().toLowerCase().replace(/\s+/g, "-");
      const label = newEventType.trim();
      
      try {
        const created = await createEventType({ value, label });
        
        if (created) {
          const newType = { value: created.value, label: created.label };
          setEventTypes(prev => [...prev, newType]);
          onAdd(newType.value);
          setAddMode(false);
          setNewEventType("");
          
          toast({
            title: "Event type added",
            description: `"${newType.label}" has been added to event types.`
          });
        }
      } catch (error) {
        console.error("Error adding event type:", error);
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
      const typeToDelete = eventTypes.find(type => type.value === value);
      if (!typeToDelete) return;
      
      // Find the event type in the database by value
      const allTypes = await getEventTypes();
      const dbType = allTypes.find(t => t.value === value);
      
      if (!dbType) {
        console.error(`Event type with value ${value} not found in database`);
        toast({
          title: "Error",
          description: "Could not find this event type in the database.",
          variant: "destructive"
        });
        return;
      }
      
      const success = await deleteEventType(dbType.id);
      
      if (success) {
        setEventTypes(prev => prev.filter(type => type.value !== value));
        onDelete(value);
        
        toast({
          title: "Event type deleted",
          description: `"${typeToDelete.label}" has been removed from event types.`
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
