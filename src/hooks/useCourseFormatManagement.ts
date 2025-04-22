
import { useSiteSettings } from "@/contexts/site-settings";
import { useFormatState } from "./useFormatState";
import { useFormatInitialization } from "./useFormatInitialization";
import { useFormatOperations } from "./useFormatOperations";

export const useCourseFormatManagement = () => {
  const { settings, refreshSettings } = useSiteSettings();
  const {
    formats,
    setFormats,
    addMode,
    setAddMode,
    newFormat,
    setNewFormat,
    isProcessing,
    setIsProcessing
  } = useFormatState();

  useFormatInitialization(settings, setFormats);

  const { handleAddFormat, handleDeleteFormat } = useFormatOperations(
    formats,
    setFormats,
    setAddMode,
    setNewFormat,
    isProcessing,
    setIsProcessing,
    refreshSettings
  );

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
