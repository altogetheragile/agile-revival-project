
import { useState, useEffect, useCallback, useRef } from "react";
import { CourseFormat, defaultFormats } from "@/types/courseFormat";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/contexts/site-settings";
import { useFormatsInitialization } from "./course-format/useFormatsInitialization";
import { useAddCourseFormat } from "./course-format/useAddCourseFormat";
import { useDeleteCourseFormat } from "./course-format/useDeleteCourseFormat";

export const useCourseFormatManagement = () => {
  const [formats, setFormats] = useState<CourseFormat[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [newFormat, setNewFormat] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Utility refs for initialization
  const isInitialized = useRef(false);
  const shouldSaveDefaults = useRef(false);
  const isInitialSave = useRef(true);

  const { toast } = useToast();
  const { settings, updateSettings, refreshSettings } = useSiteSettings();

  // Initialize formats from settings, possibly saving defaults
  useFormatsInitialization(setFormats, shouldSaveDefaults, isInitialized);

  // Save default formats if needed after initialization
  useEffect(() => {
    const saveDefaultFormats = async () => {
      if (shouldSaveDefaults.current && isInitialized.current) {
        try {
          // Use silent mode for initial default format saving
          await updateSettings("courseFormats", defaultFormats);
          shouldSaveDefaults.current = false;
          isInitialSave.current = false;
        } catch {}
      }
    };
    saveDefaultFormats();
  }, [updateSettings]);

  // Save formats to settings, with optional toast
  const saveFormatsToSettings = async (updatedFormats: CourseFormat[], showToast: boolean = false) => {
    try {
      // Skip toast on initial save
      if (isInitialSave.current) {
        await updateSettings("courseFormats", updatedFormats);
        isInitialSave.current = false;
        return true;
      }
      
      // Only show toast for user-initiated actions
      const silentMode = !showToast;
      await updateSettings("courseFormats", updatedFormats, silentMode);
      return true;
    } catch (error) {
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

  // Use extracted custom hooks for add and delete logic
  const handleAddFormat = useAddCourseFormat(
    formats, setFormats, setAddMode, setNewFormat,
    saveFormatsToSettings, refreshSettings,
    isProcessing, setIsProcessing, newFormat,
    toast
  );
  const handleDeleteFormat = useDeleteCourseFormat(
    formats, setFormats, saveFormatsToSettings, refreshSettings,
    isProcessing, setIsProcessing, toast
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
