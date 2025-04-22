
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";

export type CourseFormat = {
  value: string;
  label: string;
};

export const defaultFormats = [
  { value: "in-person", label: "In-Person" },
  { value: "online", label: "Online" },
  { value: "live", label: "Live Virtual" },
  { value: "hybrid", label: "Hybrid" }
];

export const useCourseFormatManagement = () => {
  const [formats, setFormats] = useState<CourseFormat[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newFormat, setNewFormat] = useState("");
  const { toast } = useToast();
  const { settings, updateSettings, refreshSettings } = useSiteSettings();

  // Initialize formats from settings or defaults
  useEffect(() => {
    const initFormats = () => {
      try {
        console.log("Initializing formats from settings:", settings);
        if (settings.courseFormats && Array.isArray(settings.courseFormats)) {
          console.log("Using formats from settings:", settings.courseFormats);
          setFormats(settings.courseFormats);
        } else {
          console.log("No courseFormats in settings, using defaults:", defaultFormats);
          setFormats(defaultFormats);
          // Save default formats to settings
          saveFormatsToSettings(defaultFormats).catch(err => 
            console.error("Failed to save default formats:", err)
          );
        }
      } catch (error) {
        console.error("Error initializing formats:", error);
        setFormats(defaultFormats);
      }
    };
    
    initFormats();
  }, [settings.courseFormats, updateSettings]);

  const saveFormatsToSettings = useCallback(async (updatedFormats: CourseFormat[]) => {
    try {
      console.log("Saving formats to settings:", updatedFormats);
      await updateSettings('courseFormats', updatedFormats);
      console.log("Formats saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving formats:", error);
      return false;
    }
  }, [updateSettings]);

  const handleAddFormat = useCallback(async (): Promise<string | null> => {
    if (!newFormat.trim()) {
      toast({
        title: "Error",
        description: "Format name cannot be empty",
        variant: "destructive"
      });
      return null;
    }

    // Check if format already exists
    const exists = formats.some(opt => 
      opt.value.toLowerCase() === newFormat.trim().toLowerCase().replace(/\s+/g, '-') ||
      opt.label.toLowerCase() === newFormat.trim().toLowerCase()
    );
    
    if (exists) {
      toast({
        title: "Error",
        description: `"${newFormat.trim()}" already exists in formats.`,
        variant: "destructive"
      });
      return null;
    }

    const newFmt = { 
      value: newFormat.trim().toLowerCase().replace(/\s+/g, '-'), 
      label: newFormat.trim() 
    };
    
    console.log("Adding new format:", newFmt);
    
    try {
      // Create a new array with the new format
      const updatedFormats = [...formats, newFmt];
      
      // Save to settings first
      const success = await saveFormatsToSettings(updatedFormats);
      
      if (success) {
        // Update local state
        setFormats(updatedFormats);
        setAddMode(false);
        
        // Only clear newFormat after successful save
        const formatValue = newFmt.value;
        setNewFormat("");
        
        // Force refresh settings to ensure the UI reflects the changes
        await refreshSettings();
        
        toast({
          title: "Format added",
          description: `"${newFmt.label}" has been added to formats.`
        });
        
        return formatValue;
      } else {
        toast({
          title: "Error",
          description: "There was a problem adding the format.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Error in handleAddFormat:", error);
      toast({
        title: "Error",
        description: "There was a problem adding the format.",
        variant: "destructive"
      });
      return null;
    }
  }, [formats, newFormat, refreshSettings, saveFormatsToSettings, toast]);

  const handleDeleteFormat = useCallback(async (value: string): Promise<boolean> => {
    try {
      console.log("Attempting to delete format:", value);
      const formatToDelete = formats.find(fmt => fmt.value === value);
      
      if (!formatToDelete) {
        console.error("Format not found for deletion:", value);
        toast({
          title: "Error",
          description: "Format not found.",
          variant: "destructive"
        });
        return false;
      }
      
      // Create a new array without the deleted format
      const updatedFormats = formats.filter(fmt => fmt.value !== value);
      console.log("Formats after deletion:", updatedFormats);
      
      // Save to settings first
      const success = await saveFormatsToSettings(updatedFormats);
      
      if (success) {
        console.log("Format deleted successfully, updating state");
        // Update local state
        setFormats(updatedFormats);
        
        // Force refresh settings to ensure the UI reflects the changes
        await refreshSettings();
        
        toast({
          title: "Format deleted",
          description: `"${formatToDelete?.label || value}" has been removed from formats.`
        });
        
        return true;
      } else {
        console.error("Failed to save updated formats after deletion");
        toast({
          title: "Error",
          description: "There was a problem deleting the format.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error during format deletion:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting the format.",
        variant: "destructive"
      });
      return false;
    }
  }, [formats, refreshSettings, saveFormatsToSettings, toast]);

  return {
    formats,
    addMode,
    setAddMode,
    newFormat,
    setNewFormat,
    handleAddFormat,
    handleDeleteFormat
  };
};
