
import { useSiteSettings } from "@/contexts/site-settings";
import { useEffect, useState } from "react";

export const useContactInfo = () => {
  const { settings, isLoading } = useSiteSettings();
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
  });
  
  useEffect(() => {
    if (!isLoading) {
      // Get the latest values directly from settings
      const email = settings?.general?.contactEmail || '';
      const phone = settings?.general?.contactPhone || '';
      
      console.log("useContactInfo updating with new values:", email, phone);
      
      setContactInfo({
        email,
        phone,
      });
    }
  }, [settings.general, isLoading]);

  return contactInfo;
};
