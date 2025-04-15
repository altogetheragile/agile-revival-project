
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="relative">
        <HeroSection />
        <div className="relative z-10 bg-white">
          <ServicesSection />
          <AboutSection />
          <TestimonialsSection />
          <ContactSection />
        </div>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
