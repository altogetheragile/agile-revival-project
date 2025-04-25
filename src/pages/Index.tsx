
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import JumboHero from '@/components/home/JumboHero';
import ServicesSection from '@/components/home/ServicesSection';
import FeaturedCoursesSection from '@/components/home/FeaturedCoursesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ClientLogos from '@/components/home/ClientLogos';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import BlogPreviewSection from '@/components/home/BlogPreviewSection';
import { useSiteSettings } from '@/contexts/site-settings';
import AuthStatus from '@/components/auth/AuthStatus';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { settings, isLoading } = useSiteSettings();
  const { isAuthReady } = useAuth();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  
  // Set page as loaded after a delay to ensure components render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show sections based on site settings
  const showServices = settings.home?.showServices !== false;
  const showFeaturedCourses = settings.home?.showFeaturedCourses !== false;
  const showTestimonials = settings.home?.showTestimonials !== false;
  const showClientLogos = settings.home?.showClientLogos !== false;
  const showAbout = settings.home?.showAbout !== false;
  const showBlog = settings.home?.showBlog !== false;
  const showContact = settings.home?.showContact !== false;

  return (
    <MainLayout>
      {isAuthReady && <AuthStatus className="container mx-auto px-4 mt-24 mb-4" />}
      
      <JumboHero />
      
      {showServices && (
        <ServicesSection />
      )}
      
      {showFeaturedCourses && (
        <FeaturedCoursesSection />
      )}
      
      {showTestimonials && (
        <TestimonialsSection />
      )}
      
      {showClientLogos && (
        <ClientLogos />
      )}
      
      {showAbout && (
        <AboutSection />
      )}
      
      {showBlog && (
        <BlogPreviewSection />
      )}
      
      {showContact && (
        <ContactSection />
      )}
    </MainLayout>
  );
}

