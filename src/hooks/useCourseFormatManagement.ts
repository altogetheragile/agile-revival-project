
import { useState, useEffect, useCallback } from "react";
import { CourseFormat, defaultFormats } from "@/types/courseFormat";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";
import { validateNewFormat, createFormatObject } from "@/utils/formatUtils";

export const useCourseFormatManagement = () => {
  const [formats, setFormats] = useState<CourseFormat[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newFormat, setNewFormat] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { settings, updateSettings, refreshSettings } = useSiteSettings();

  // Initialize formats from settings
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
  }, [settings.courseFormats]);

  // Save formats to settings
  const saveFormatsToSettings = async (updatedFormats: CourseFormat[]) => {
    try {
      console.log("Saving formats to settings:", updatedFormats);
      await updateSettings('courseFormats', updatedFormats);
      console.log("Formats saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving formats:", error);
      toast({
        title: "Error",
        description: "Failed to save format changes",
        variant: "destructive"
      });
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
      
      const success = await saveFormatsToSettings(updatedFormats);
      
      if (success) {
        setAddMode(false);
        const formatValue = newFmt.value;
        setNewFormat("");
        
        await refreshSettings();
        
        toast({
          title: "Format added",
          description: `"${newFmt.label}" has been added to formats.`
        });
        
        setIsProcessing(false);
        return formatValue;
      }
      
      setFormats(formats);
      toast({
        title: "Error",
        description: "There was a problem adding the format.",
        variant: "destructive"
      });
      
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
      
      const success = await saveFormatsToSettings(updatedFormats);
      
      if (success) {
        await refreshSettings();
        
        toast({
          title: "Format deleted",
          description: `"${formatToDelete?.label || value}" has been removed from formats.`
        });
        
        setIsProcessing(false);
        return true;
      }
      
      setFormats(formats);
      toast({
        title: "Error",
        description: "There was a problem deleting the format.",
        variant: "destructive"
      });
      
      setIsProcessing(false);
      return false;
    } catch (error) {
      console.error("Error during format deletion:", error);
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
