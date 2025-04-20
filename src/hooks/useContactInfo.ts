
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/contexts/site-settings";

type ContactInfo = {
  email: string;
  phone: string;
  location: {
    address: string;
    city: string;
    country: string;
  };
  socialMedia: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
};

export const useContactInfo = () => {
  const { settings, isLoading } = useSiteSettings();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    location: {
      address: '',
      city: '',
      country: '',
    },
    socialMedia: {}
  });

  useEffect(() => {
    if (!isLoading && settings?.general) {
      const { contactEmail, contactPhone, location, socialMedia } = settings.general;
      
      console.log("useContactInfo updating with:", { contactEmail, contactPhone, location, socialMedia });
      
      setContactInfo({
        email: contactEmail || '',
        phone: contactPhone || '',
        location: location || { address: '', city: '', country: '' },
        socialMedia: socialMedia || {}
      });
    }
  }, [settings?.general, isLoading]);

  return contactInfo;
};
