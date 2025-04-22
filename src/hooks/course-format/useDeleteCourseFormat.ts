
import { useCallback } from "react";
import { CourseFormat } from "@/types/courseFormat";
import { useToast } from "@/hooks/use-toast";

export function useDeleteCourseFormat(
  formats: CourseFormat[],
  setFormats: React.Dispatch<React.SetStateAction<CourseFormat[]>>,
  saveFormatsToSettings: (updatedFormats: CourseFormat[], showToast?: boolean) => Promise<boolean>,
  refreshSettings: () => Promise<void>,
  isProcessing: boolean,
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>,
  toast: ReturnType<typeof useToast>["toast"]
) {
  // Handles deletion of a course format
  return useCallback(async (value: string): Promise<boolean> => {
    if (isProcessing) return false;

    setIsProcessing(true);

    try {
      const formatToDelete = formats.find(fmt => fmt.value === value);
      if (!formatToDelete) {
        toast({
          title: "Error",
          description: "Format not found.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return false;
      }

      const updatedFormats = formats.filter(fmt => fmt.value !== value);
      setFormats(updatedFormats);
      const success = await saveFormatsToSettings(updatedFormats, true);

      if (success) {
        await refreshSettings();
        setIsProcessing(false);
        return true;
      }
      setFormats(formats);
      setIsProcessing(false);
      return false;
    } catch {
      setFormats(formats);
      toast({
        title: "Error",
        description: "There was a problem deleting the format.",
        variant: "destructive"
      });
      setIsProcessing(false);
      return false;
    }
    // eslint-disable-next-line
  }, [formats, refreshSettings, toast, isProcessing]);
}
