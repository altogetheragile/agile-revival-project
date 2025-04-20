
import { useState, useEffect, useCallback } from "react";
import { useSiteSettings } from "@/contexts/site-settings";

export const useContactInfo = () => {
  const { settings, isLoading } = useSiteSettings();
  const [contactInfo, setContactInfo] = useState({
    email: settings?.general?.contactEmail || '',
    phone: settings?.general?.contactPhone || '',
  });

  // Use a callback to update the contact info whenever settings change
  const updateContactInfo = useCallback(() => {
    if (settings?.general) {
      const email = settings.general.contactEmail || '';
      const phone = settings.general.contactPhone || '';
      
      console.log("useContactInfo updating with:", email, phone);
      
      if (email !== contactInfo.email || phone !== contactInfo.phone) {
        setContactInfo({ email, phone });
      }
    }
  }, [settings?.general, contactInfo.email, contactInfo.phone]);
  
  // Update contact info when settings change or component mounts
  useEffect(() => {
    updateContactInfo();
  }, [updateContactInfo]);

  return contactInfo;
};
