
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
  // Initialize with proper empty values to avoid undefined issues
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
    if (settings?.general) {
      const { contactEmail, contactPhone, location, socialMedia } = settings.general;
      
      // Create default empty objects if location or socialMedia are undefined
      const safeLocation = location || { address: '', city: '', country: '' };
      const safeSocialMedia = socialMedia || {};
      
      console.log("useContactInfo updating with:", { 
        contactEmail, 
        contactPhone, 
        location: safeLocation, 
        socialMedia: safeSocialMedia 
      });
      
      setContactInfo({
        email: contactEmail || '',
        phone: contactPhone || '',
        location: safeLocation,
        socialMedia: safeSocialMedia
      });
    }
  }, [settings?.general]);

  return contactInfo;
};
