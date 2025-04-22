
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
  const [isProcessing, setIsProcessing] = useState(false);
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

  // Debounce function to prevent multiple rapid calls
  const debounce = useCallback((fn: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }, []);

  // Save formats to settings with debounce
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

  // Debounced save to prevent multiple rapid saves
  const debouncedSave = useCallback(
    debounce(async (formats: CourseFormat[]) => {
      return await saveFormatsToSettings(formats);
    }, 300),
    [saveFormatsToSettings, debounce]
  );

  const handleAddFormat = useCallback(async (): Promise<string | null> => {
    if (isProcessing) {
      console.log("Already processing a format change, skipping");
      return null;
    }

    if (!newFormat.trim()) {
      toast({
        title: "Error",
        description: "Format name cannot be empty",
        variant: "destructive"
      });
      return null;
    }

    setIsProcessing(true);

    try {
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
        setIsProcessing(false);
        return null;
      }

      const newFmt = { 
        value: newFormat.trim().toLowerCase().replace(/\s+/g, '-'), 
        label: newFormat.trim() 
      };
      
      console.log("Adding new format:", newFmt);
      
      // Create a new array with the new format
      const updatedFormats = [...formats, newFmt];
      
      // Update local state first for immediate feedback
      setFormats(updatedFormats);
      
      // Save to settings
      const success = await saveFormatsToSettings(updatedFormats);
      
      if (success) {
        setAddMode(false);
        
        // Store value before clearing the input
        const formatValue = newFmt.value;
        setNewFormat("");
        
        // Force refresh settings to ensure the UI reflects the changes
        await refreshSettings();
        
        toast({
          title: "Format added",
          description: `"${newFmt.label}" has been added to formats.`
        });
        
        setIsProcessing(false);
        return formatValue;
      } else {
        // Revert state if save failed
        setFormats(formats);
        
        toast({
          title: "Error",
          description: "There was a problem adding the format.",
          variant: "destructive"
        });
        
        setIsProcessing(false);
        return null;
      }
    } catch (error) {
      console.error("Error in handleAddFormat:", error);
      // Revert state if there was an error
      setFormats(formats);
      
      toast({
        title: "Error",
        description: "There was a problem adding the format.",
        variant: "destructive"
      });
      
      setIsProcessing(false);
      return null;
    }
  }, [formats, newFormat, refreshSettings, saveFormatsToSettings, toast, isProcessing]);

  const handleDeleteFormat = useCallback(async (value: string): Promise<boolean> => {
    if (isProcessing) {
      console.log("Already processing a format change, skipping");
      return false;
    }

    setIsProcessing(true);

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
        setIsProcessing(false);
        return false;
      }
      
      // Create a new array without the deleted format
      const updatedFormats = formats.filter(fmt => fmt.value !== value);
      console.log("Formats after deletion:", updatedFormats);
      
      // Update local state first for immediate feedback
      setFormats(updatedFormats);
      
      // Save to settings
      const success = await saveFormatsToSettings(updatedFormats);
      
      if (success) {
        // Force refresh settings to ensure the UI reflects the changes
        await refreshSettings();
        
        toast({
          title: "Format deleted",
          description: `"${formatToDelete?.label || value}" has been removed from formats.`
        });
        
        setIsProcessing(false);
        return true;
      } else {
        // Revert state if save failed
        setFormats(formats);
        
        toast({
          title: "Error",
          description: "There was a problem deleting the format.",
          variant: "destructive"
        });
        
        setIsProcessing(false);
        return false;
      }
    } catch (error) {
      console.error("Error during format deletion:", error);
      // Revert state if there was an error
      setFormats(formats);
      
      toast({
        title: "Error",
        description: "There was a problem deleting the format.",
        variant: "destructive"
      });
      
      setIsProcessing(false);
      return false;
    }
  }, [formats, refreshSettings, saveFormatsToSettings, toast, isProcessing]);

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
