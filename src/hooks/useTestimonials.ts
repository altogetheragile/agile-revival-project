
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseTestimonial, Testimonial, mapSupabaseToTestimonial } from '@/types/testimonials';
import { testimonials as fallbackTestimonials } from '@/data/testimonials';

export function useTestimonials(limit: number = 10) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    // Randomly shuffle and limit fallback testimonials
    [...fallbackTestimonials]
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('testimonials')
          .select('*');

        if (error) {
          console.error('Error fetching testimonials:', error);
          setError('Failed to load testimonials');
          return;
        }

        if (data && data.length > 0) {
          // Map the Supabase data to our app's format
          const mappedTestimonials = data.map((item: SupabaseTestimonial) => 
            mapSupabaseToTestimonial(item)
          );
          
          // Randomly shuffle and limit testimonials
          const randomizedTestimonials = [...mappedTestimonials]
            .sort(() => Math.random() - 0.5)
            .slice(0, limit);
            
          setTestimonials(randomizedTestimonials);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonials();
  }, [limit]);

  return { testimonials, isLoading, error };
}
