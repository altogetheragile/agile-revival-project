
import React, { useEffect } from 'react';
import { Testimonial } from '@/types/testimonials';
import { LinkedInLoadingState } from './linkedin/LinkedInLoadingState';
import { LinkedInErrorAlert } from './linkedin/LinkedInErrorAlert';
import { LinkedInLoadButton } from './linkedin/LinkedInLoadButton';
import { useLinkedInRecommendationsLoader } from './linkedin/useLinkedInRecommendationsLoader';

interface LinkedInLoaderProps {
  onTestimonialsLoaded: (testimonials: Testimonial[]) => void;
  autoLoad?: boolean;
}

const LinkedInLoader = ({ onTestimonialsLoaded, autoLoad = true }: LinkedInLoaderProps) => {
  const { loading, errorMessage, loadLinkedInTestimonials } = useLinkedInRecommendationsLoader(onTestimonialsLoaded);

  useEffect(() => {
    if (autoLoad) {
      loadLinkedInTestimonials();
    }
  }, [autoLoad]);
  
  return (
    <>
      <LinkedInLoadingState loading={loading} />
      
      {!loading && errorMessage && (
        <LinkedInErrorAlert 
          errorMessage={errorMessage}
          loading={loading}
          onRetry={loadLinkedInTestimonials}
        />
      )}
      
      {!loading && !errorMessage && (
        <LinkedInLoadButton 
          loading={loading}
          onLoad={loadLinkedInTestimonials}
        />
      )}
    </>
  );
};

export default LinkedInLoader;
