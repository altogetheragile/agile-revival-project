
import React, { useEffect } from 'react';
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import { Toaster } from '@/components/ui/toaster';
import PageTitle from "@/components/layout/PageTitle";

const Index = () => {
  useEffect(() => {
    console.log("Index component mounted");
    return () => {
      console.log("Index component unmounted");
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PageTitle />
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
