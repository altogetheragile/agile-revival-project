
import { useSiteSettings } from "@/contexts/site-settings";
import { useEffect, useState } from "react";

export const useContactInfo = () => {
  const { settings, isLoading } = useSiteSettings();
  const [contactInfo, setContactInfo] = useState({
    email: settings.general.contactEmail,
    phone: settings.general.contactPhone,
  });
  
  // Update local state whenever settings change
  useEffect(() => {
    if (!isLoading) {
      setContactInfo({
        email: settings.general.contactEmail,
        phone: settings.general.contactPhone,
      });
    }
  }, [settings.general.contactEmail, settings.general.contactPhone, isLoading]);

  return contactInfo;
};
