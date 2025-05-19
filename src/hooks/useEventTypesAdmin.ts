
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  EventType, 
  getEventTypes, 
  createEventType, 
  updateEventType, 
  deleteEventType,
  getEventTypeUsageCounts
} from "@/services/event/eventTypeService";

export const useEventTypesAdmin = () => {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();
  
  // Load event types
  const loadEventTypes = async () => {
    setIsLoading(true);
    try {
      const [types, counts] = await Promise.all([
        getEventTypes(),
        getEventTypeUsageCounts()
      ]);
      setEventTypes(types);
      setUsageCounts(counts);
    } catch (error) {
      console.error("Error loading event types:", error);
      toast({
        title: "Error",
        description: "Failed to load event types",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load event types on mount
  useEffect(() => {
    loadEventTypes();
  }, []);
  
  // Add a new event type
  const addEventType = async (value: string, label: string) => {
    setIsSubmitting(true);
    try {
      const eventType = await createEventType({ value, label });
      if (eventType) {
        setEventTypes(prev => [...prev, eventType]);
        toast({
          title: "Success",
          description: `Event type "${label}" has been created`
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding event type:", error);
      toast({
        title: "Error",
        description: "Failed to create event type",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Update an existing event type
  const editEventType = async (id: string, value: string, label: string) => {
    setIsSubmitting(true);
    try {
      const eventType = await updateEventType(id, { value, label });
      if (eventType) {
        setEventTypes(prev => 
          prev.map(type => type.id === id ? eventType : type)
        );
        toast({
          title: "Success",
          description: `Event type "${label}" has been updated`
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating event type:", error);
      toast({
        title: "Error",
        description: "Failed to update event type",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete an event type
  const removeEventType = async (id: string, label: string) => {
    setIsSubmitting(true);
    try {
      const success = await deleteEventType(id);
      if (success) {
        setEventTypes(prev => prev.filter(type => type.id !== id));
        // Also remove from usage counts
        const newCounts = { ...usageCounts };
        delete newCounts[id];
        setUsageCounts(newCounts);
        
        toast({
          title: "Success",
          description: `Event type "${label}" has been deleted`
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting event type:", error);
      toast({
        title: "Error",
        description: "Failed to delete event type",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get usage count for an event type
  const getUsageCount = (id: string): number => {
    return usageCounts[id] || 0;
  };
  
  return {
    eventTypes,
    isLoading,
    isSubmitting,
    loadEventTypes,
    addEventType,
    editEventType,
    removeEventType,
    getUsageCount
  };
};
