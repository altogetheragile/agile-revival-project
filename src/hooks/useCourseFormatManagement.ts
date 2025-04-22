
import { useState, useEffect } from "react";
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
  const { settings, updateSettings } = useSiteSettings();

  useEffect(() => {
    const initFormats = () => {
      if (settings.courseFormats && Array.isArray(settings.courseFormats)) {
        console.log("Loading formats from settings:", settings.courseFormats);
        setFormats(settings.courseFormats);
      } else {
        console.log("No courseFormats in settings, using defaults:", defaultFormats);
        setFormats(defaultFormats);
        // Save default formats to settings
        saveFormatsToSettings(defaultFormats).catch(err => 
          console.error("Failed to save default formats:", err)
        );
      }
    };
    
    initFormats();
  }, [settings]);

  const saveFormatsToSettings = async (updatedFormats: CourseFormat[]) => {
    try {
      console.log("Saving formats to settings:", updatedFormats);
      await updateSettings('courseFormats', updatedFormats);
      console.log("Formats saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving formats:", error);
      return false;
    }
  };

  const handleAddFormat = async (): Promise<string | null> => {
    if (!newFormat.trim()) {
      toast({
        title: "Error",
        description: "Format name cannot be empty",
        variant: "destructive"
      });
      return null;
    }

    // Check if format already exists
    if (formats.some(opt => opt.value.toLowerCase() === newFormat.trim().toLowerCase() ||
                           opt.label.toLowerCase() === newFormat.trim().toLowerCase())) {
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
    const updatedFormats = [...formats, newFmt];
    
    console.log("Adding new format:", newFmt);
    try {
      const success = await saveFormatsToSettings(updatedFormats);
      
      if (success) {
        setFormats(updatedFormats);
        setAddMode(false);
        setNewFormat("");
        
        toast({
          title: "Format added",
          description: `"${newFmt.label}" has been added to formats.`
        });
        
        return newFmt.value;
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
  };

  const handleDeleteFormat = async (value: string): Promise<boolean> => {
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
      
      const updatedFormats = formats.filter(fmt => fmt.value !== value);
      console.log("Formats after deletion:", updatedFormats);
      
      const success = await saveFormatsToSettings(updatedFormats);
      
      if (success) {
        console.log("Format deleted successfully, updating state");
        setFormats(updatedFormats);
        
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
  };

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
