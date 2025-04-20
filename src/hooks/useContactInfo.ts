
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/contexts/site-settings";

export const useContactInfo = () => {
  const { settings, isLoading } = useSiteSettings();
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!isLoading && settings?.general) {
      const email = settings.general.contactEmail || '';
      const phone = settings.general.contactPhone || '';
      
      console.log("useContactInfo updating with:", email, phone);
      setContactInfo({ email, phone });
    }
  }, [settings?.general, isLoading]);

  return contactInfo;
};
