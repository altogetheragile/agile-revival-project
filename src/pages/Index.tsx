
import React, { useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import AboutSection from "@/components/sections/AboutSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import { Toaster } from '@/components/ui/toaster';
import PageTitle from "@/components/layout/PageTitle";
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

// Simple fallback component for section errors
const SectionErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="py-20 px-6 bg-gray-50 text-center">
      <h3 className="text-xl font-medium text-gray-900">Section could not be loaded</h3>
      <p className="mt-2 text-sm text-gray-500">We're working on fixing this issue.</p>
      <button 
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
};

const Index = () => {
  useEffect(() => {
    console.log("Index component mounted");
    
    // Validate page loaded correctly
    toast.success("Welcome to Altogether Agile", {
      description: "Explore our services and discover how we can help you transform your organization",
      duration: 4000,
      position: "bottom-right"
    });
    
    return () => {
      console.log("Index component unmounted");
    };
  }, []);

  return (
    <MainLayout>
      <PageTitle />
      <main className="relative">
        <ErrorBoundary FallbackComponent={SectionErrorFallback}>
          <HeroSection />
        </ErrorBoundary>
        <div className="relative z-10 bg-white">
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <ServicesSection />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <AboutSection />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <TestimonialsSection />
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <ContactSection />
          </ErrorBoundary>
        </div>
      </main>
      <Toaster />
    </MainLayout>
  );
};

export default Index;
