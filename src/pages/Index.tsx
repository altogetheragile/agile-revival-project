
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
import { initWorkshopButler } from '@/utils/workshopButlerLoader';
import { Toast } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [widgetsLoaded, setWidgetsLoaded] = useState(false);
  const { toast } = useToast();

  // Initialize SociableKIT and Workshop Butler on page load
  useEffect(() => {
    let cleanupSociableKit: (() => void) | undefined;
    let cleanupWorkshopButler: (() => void) | undefined;
    
    const initWidgets = async () => {
      try {
        // Initialize SociableKIT
        cleanupSociableKit = initSociableKit();
        
        // Initialize Workshop Butler with enhanced error handling
        cleanupWorkshopButler = await initWorkshopButler();
        console.log("Widgets initialization complete");
        setWidgetsLoaded(true);
      } catch (error) {
        console.error("Error initializing widgets:", error);
        toast({
          title: "Widget Error",
          description: "There was an issue loading some widgets. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    initWidgets();
    
    // Clean up on component unmount
    return () => {
      if (cleanupSociableKit) cleanupSociableKit();
      if (cleanupWorkshopButler) cleanupWorkshopButler();
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
    </div>
  );
};

export default Index;
