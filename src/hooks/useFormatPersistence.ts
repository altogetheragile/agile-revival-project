
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";
import { CourseFormat } from "@/types/courseFormat";
import { debounce } from "@/utils/formatUtils";

export const useFormatPersistence = () => {
  const { updateSettings } = useSiteSettings();
  const { toast } = useToast();

  const saveFormatsToSettings = useCallback(async (updatedFormats: CourseFormat[]) => {
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
  }, [updateSettings, toast]);

  const debouncedSave = useCallback(
    debounce(async (formats: CourseFormat[]) => {
      return await saveFormatsToSettings(formats);
    }, 300),
    [saveFormatsToSettings]
  );

  return {
    saveFormatsToSettings,
    debouncedSave
  };
};
