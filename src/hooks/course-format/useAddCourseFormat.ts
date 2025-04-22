
import { useCallback } from "react";
import { CourseFormat } from "@/types/courseFormat";
import { useToast } from "@/hooks/use-toast";
import { validateNewFormat, createFormatObject } from "@/utils/formatUtils";

export function useAddCourseFormat(
  formats: CourseFormat[],
  setFormats: React.Dispatch<React.SetStateAction<CourseFormat[]>>,
  setAddMode: React.Dispatch<React.SetStateAction<boolean>>,
  setNewFormat: React.Dispatch<React.SetStateAction<string>>,
  saveFormatsToSettings: (updatedFormats: CourseFormat[], showToast?: boolean) => Promise<boolean>,
  refreshSettings: () => Promise<void>,
  isProcessing: boolean,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  newFormat: string,
  toast: ReturnType<typeof useToast>["toast"]
) {
  // Handles the addition of a new course format
  return useCallback(async (): Promise<string | null> => {
    if (isProcessing) return null;

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
      const updatedFormats = [...formats, newFmt];
      setFormats(updatedFormats);
      const success = await saveFormatsToSettings(updatedFormats, true);

      if (success) {
        setAddMode(false);
        const formatValue = newFmt.value;
        setNewFormat("");
        await refreshSettings();
        setIsProcessing(false);
        return formatValue;
      }
      setFormats(formats);
      setIsProcessing(false);
      return null;
    } catch {
      setFormats(formats);
      toast({
        title: "Error",
        description: "There was a problem adding the format.",
        variant: "destructive"
      });
      setIsProcessing(false);
      return null;
    }
  // eslint-disable-next-line
  }, [formats, newFormat, refreshSettings, toast, isProcessing]);
}
