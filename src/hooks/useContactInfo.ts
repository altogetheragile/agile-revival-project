
import { useSiteSettings } from "@/contexts/site-settings";
import { useEffect, useState } from "react";

export const useContactInfo = () => {
  const { settings, isLoading } = useSiteSettings();
  const [contactInfo, setContactInfo] = useState({
    email: '',  // Initialize with empty values
    phone: '',  // to avoid showing stale data
  });
  
  // Update local state whenever settings change or when loading completes
  useEffect(() => {
    if (!isLoading) {
      console.log("useContactInfo updating with:", 
        settings.general.contactEmail, 
        settings.general.contactPhone
      );
      
      setContactInfo({
        email: settings.general.contactEmail || '',
        phone: settings.general.contactPhone || '',
      });
    }
  }, [settings.general.contactEmail, settings.general.contactPhone, isLoading]);

  return contactInfo;
};
