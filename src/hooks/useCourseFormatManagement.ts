
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
        setFormats(settings.courseFormats);
      } else {
        setFormats(defaultFormats);
      }
    };
    
    initFormats();
  }, [settings]);

  const saveFormatsToSettings = async (updatedFormats: CourseFormat[]) => {
    try {
      await updateSettings('courseFormats', updatedFormats);
      console.log("Formats saved successfully:", updatedFormats);
      return true;
    } catch (error) {
      console.error("Error saving formats:", error);
      return false;
    }
  };

  const handleAddFormat = async (onAdd: (value: string) => void) => {
    if (
      newFormat.trim() &&
      !formats.some(opt => opt.value.toLowerCase() === newFormat.trim().toLowerCase())
    ) {
      const newFmt = { value: newFormat.trim().toLowerCase(), label: newFormat.trim() };
      const updatedFormats = [...formats, newFmt];
      
      const success = await saveFormatsToSettings(updatedFormats);
      
      if (success) {
        setFormats(updatedFormats);
        onAdd(newFmt.value);
        setAddMode(false);
        setNewFormat("");
        
        toast({
          title: "Format added",
          description: `"${newFmt.label}" has been added to formats.`
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem adding the format.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteFormat = async (value: string, onDelete: (value: string) => void) => {
    try {
      const updatedFormats = formats.filter(fmt => fmt.value !== value);
      const deletedFormat = formats.find(fmt => fmt.value === value);
      
      const success = await saveFormatsToSettings(updatedFormats);
      
      if (success) {
        setFormats(updatedFormats);
        onDelete(value);
        
        toast({
          title: "Format deleted",
          description: `"${deletedFormat?.label || value}" has been removed from formats.`
        });
      } else {
        toast({
          title: "Error",
          description: "There was a problem deleting the format.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting format:", error);
      toast({
        title: "Error",
        description: "There was a problem deleting the format.",
        variant: "destructive"
      });
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
