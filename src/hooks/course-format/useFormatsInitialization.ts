
import { useEffect, useRef } from "react";
import { CourseFormat, defaultFormats } from "@/types/courseFormat";
import { useSiteSettings } from "@/contexts/site-settings";

// This hook initializes formats state and controls silent saving of defaults.
export function useFormatsInitialization(
  setFormats: React.Dispatch<React.SetStateAction<CourseFormat[]>>,
  shouldSaveDefaults: React.MutableRefObject<boolean>,
  isInitialized: React.MutableRefObject<boolean>
) {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (isInitialized.current) return;
    try {
      if (
        settings.courseFormats &&
        Array.isArray(settings.courseFormats) &&
        settings.courseFormats.length > 0
      ) {
        setFormats(settings.courseFormats);
        isInitialized.current = true;
      } else if (Object.keys(settings).length > 0) {
        setFormats(defaultFormats);
        isInitialized.current = true;
        shouldSaveDefaults.current = true;
      }
    } catch {
      if (!isInitialized.current) {
        setFormats(defaultFormats);
        isInitialized.current = true;
      }
    }
  }, [settings, setFormats, isInitialized, shouldSaveDefaults]);
}
