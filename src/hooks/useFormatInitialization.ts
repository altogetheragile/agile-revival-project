
import { useEffect } from "react";
import { CourseFormat, defaultFormats } from "@/types/courseFormat";
import { useFormatPersistence } from "./useFormatPersistence";

export const useFormatInitialization = (
  settings: any,
  setFormats: (formats: CourseFormat[]) => void
) => {
  const { saveFormatsToSettings } = useFormatPersistence();

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
  }, [settings.courseFormats, saveFormatsToSettings, setFormats]);
};
