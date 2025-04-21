
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
    tiktok?: string;
    bluesky?: string;
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
    socialMedia: {
      twitter: '',
      linkedin: '',
      facebook: '',
      instagram: '',
      tiktok: '',
      bluesky: ''
    }
  });

  useEffect(() => {
    if (!settings || !settings.general) {
      console.log("Settings or general settings not available yet");
      return;
    }

    try {
      const { contactEmail, contactPhone } = settings.general;
      
      // Create default empty objects if location or socialMedia are undefined
      const location = settings.general.location || { address: '', city: '', country: '' };
      const socialMedia = settings.general.socialMedia || { twitter: '', linkedin: '', facebook: '', instagram: '', tiktok: '', bluesky: '' };
      
      console.log("useContactInfo updating with:", { 
        contactEmail, 
        contactPhone, 
        location, 
        socialMedia 
      });
      
      setContactInfo({
        email: contactEmail || '',
        phone: contactPhone || '',
        location: {
          address: location.address || '',
          city: location.city || '',
          country: location.country || ''
        },
        socialMedia: {
          twitter: socialMedia.twitter || '',
          linkedin: socialMedia.linkedin || '',
          facebook: socialMedia.facebook || '',
          instagram: socialMedia.instagram || '',
          tiktok: socialMedia.tiktok || '',
          bluesky: socialMedia.bluesky || ''
        }
      });
    } catch (error) {
      console.error("Error in useContactInfo:", error);
      // Maintain the default state if there's an error
    }
  }, [settings?.general]);

  return contactInfo;
};
