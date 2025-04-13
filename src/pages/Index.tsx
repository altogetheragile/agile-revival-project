
import { useEffect, useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import WorkshopFeedbackSection from "@/components/sections/WorkshopFeedbackSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { initSociableKit } from '@/utils/sociableKitLoader';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [sociableKitLoaded, setSociableKitLoaded] = useState(false);
  const { toast } = useToast();

  // Only initialize SociableKIT for non-testimonial widgets (if needed)
  useEffect(() => {
    let cleanupSociableKit: (() => void) | undefined;
    
    const loadSociableKit = async () => {
      try {
        // Initialize SociableKIT for non-testimonial widgets
        cleanupSociableKit = initSociableKit();
        console.log("SociableKIT initialization complete");
        setSociableKitLoaded(true);
      } catch (error) {
        console.error("Error initializing SociableKIT:", error);
        toast({
          title: "Widget Error",
          description: "There was an issue loading social widgets. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    loadSociableKit();
    
    // Clean up on component unmount
    return () => {
      if (cleanupSociableKit) cleanupSociableKit();
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <WorkshopFeedbackSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
};

export default Index;
