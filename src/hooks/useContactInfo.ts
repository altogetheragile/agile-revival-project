
import { useSiteSettings } from "@/contexts/site-settings";

export const useContactInfo = () => {
  const { settings } = useSiteSettings();
  
  return {
    email: settings.general.contactEmail,
    phone: settings.general.contactPhone,
  };
};
