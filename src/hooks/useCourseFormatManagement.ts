
import { useState, useEffect, useCallback, useRef } from "react";
import { CourseFormat, defaultFormats } from "@/types/courseFormat";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";
import { validateNewFormat, createFormatObject } from "@/utils/formatUtils";

export const useCourseFormatManagement = () => {
  const [formats, setFormats] = useState<CourseFormat[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newFormat, setNewFormat] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use refs to track initialization state
  const isInitialized = useRef(false);
  const shouldSaveDefaults = useRef(false);
  
  const { toast } = useToast();
  const { settings, updateSettings, refreshSettings } = useSiteSettings();

  // Initialize formats from settings - with careful handling to prevent unnecessary operations
  useEffect(() => {
    // Skip if already initialized to prevent re-triggering
    if (isInitialized.current) {
      return;
    }
    
    try {
      console.log("Initializing formats from settings:", settings);
      
      // Check if we have valid settings and courseFormats
      if (settings.courseFormats && Array.isArray(settings.courseFormats) && settings.courseFormats.length > 0) {
        console.log("Using formats from settings:", settings.courseFormats);
        setFormats(settings.courseFormats);
        isInitialized.current = true;
      } 
      // Only save defaults if settings exist but courseFormats is missing/empty
      else if (Object.keys(settings).length > 0) {
        console.log("No courseFormats in settings, using defaults:", defaultFormats);
        setFormats(defaultFormats);
        isInitialized.current = true;
        
        // Mark that defaults should be saved, but don't do it in this effect
        shouldSaveDefaults.current = true;
      }
    } catch (error) {
      console.error("Error initializing formats:", error);
      if (!isInitialized.current) {
        setFormats(defaultFormats);
        isInitialized.current = true;
      }
    }
  }, [settings]);

  // Handle saving default formats in a separate effect to prevent initialization loops
  useEffect(() => {
    const saveDefaultFormats = async () => {
      if (shouldSaveDefaults.current && isInitialized.current) {
        console.log("Saving default formats silently");
        try {
          await updateSettings('courseFormats', defaultFormats);
          console.log("Default formats saved successfully");
          shouldSaveDefaults.current = false;
        } catch (err) {
          console.error("Failed to save default formats:", err);
        }
      }
    };
    
    saveDefaultFormats();
  }, [updateSettings]);

  // Save formats to settings - without automatic toast
  const saveFormatsToSettings = async (updatedFormats: CourseFormat[], showToast: boolean = false) => {
    try {
      console.log("Saving formats to settings:", updatedFormats);
      await updateSettings('courseFormats', updatedFormats);
      console.log("Formats saved successfully");
      
      if (showToast) {
        toast({
          title: "Success",
          description: "Format changes saved successfully",
        });
      }
      return true;
    } catch (error) {
      console.error("Error saving formats:", error);
      
      if (showToast) {
        toast({
          title: "Error",
          description: "Failed to save format changes",
          variant: "destructive"
        });
      }
      return false;
    }
  };

  // Handle adding a new format
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
      if (!validateNewFormat(formats, newFormat)) {
        toast({
          title: "Error",
          description: `"${newFormat.trim()}" already exists in formats.`,
          variant: "destructive"
        });
        setIsProcessing(false);
        return null;
      }

      const newFmt = createFormatObject(newFormat);
      console.log("Adding new format:", newFmt);
      
      const updatedFormats = [...formats, newFmt];
      setFormats(updatedFormats);
      
      // Always show toast for user-initiated actions
      const success = await saveFormatsToSettings(updatedFormats, true);
      
      if (success) {
        setAddMode(false);
        const formatValue = newFmt.value;
        setNewFormat("");
        
        await refreshSettings();
        setIsProcessing(false);
        return formatValue;
      }
      
      // Roll back on failure
      setFormats(formats);
      
      setIsProcessing(false);
      return null;
    } catch (error) {
      console.error("Error in handleAddFormat:", error);
      setFormats(formats);
      
      toast({
        title: "Error",
        description: "There was a problem adding the format.",
        variant: "destructive"
      });
      
      setIsProcessing(false);
      return null;
    }
  }, [formats, newFormat, refreshSettings, toast, isProcessing]);

  // Handle deleting a format
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
      
      const updatedFormats = formats.filter(fmt => fmt.value !== value);
      console.log("Formats after deletion:", updatedFormats);
      
      setFormats(updatedFormats);
      
      // Always show toast for user-initiated actions
      const success = await saveFormatsToSettings(updatedFormats, true);
      
      if (success) {
        await refreshSettings();
        setIsProcessing(false);
        return true;
      }
      
      // Roll back on failure
      setFormats(formats);
      
      setIsProcessing(false);
      return false;
    } catch (error) {
      console.error("Error during format deletion:", error);
      // Roll back on error
      setFormats(formats);
      
      toast({
        title: "Error",
        description: "There was a problem deleting the format.",
        variant: "destructive"
      });
      
      setIsProcessing(false);
      return false;
    }
  }, [formats, refreshSettings, toast, isProcessing]);

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
