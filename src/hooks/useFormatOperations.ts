
import { useCallback } from "react";
import { CourseFormat } from "@/types/courseFormat";
import { useToast } from "@/hooks/use-toast";
import { validateNewFormat, createFormatObject } from "@/utils/formatUtils";
import { useFormatPersistence } from "./useFormatPersistence";

export const useFormatOperations = (
  formats: CourseFormat[],
  setFormats: (formats: CourseFormat[]) => void,
  setAddMode: (mode: boolean) => void,
  setNewFormat: (format: string) => void,
  isProcessing: boolean,
  setIsProcessing: (processing: boolean) => void,
  refreshSettings: () => Promise<void>,
  newFormat: string
) => {
  const { toast } = useToast();
  const { saveFormatsToSettings } = useFormatPersistence();

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
  }, [formats, newFormat, refreshSettings, saveFormatsToSettings, toast, isProcessing, setAddMode, setFormats, setIsProcessing, setNewFormat]);

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
  }, [formats, refreshSettings, saveFormatsToSettings, toast, isProcessing, setFormats, setIsProcessing]);

  return {
    handleAddFormat,
    handleDeleteFormat
  };
};
