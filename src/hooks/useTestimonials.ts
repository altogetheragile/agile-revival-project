
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupabaseTestimonial, Testimonial, mapSupabaseToTestimonial } from '@/types/testimonials';
import { testimonials as fallbackTestimonials } from '@/data/testimonials';

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
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
          setTestimonials(mappedTestimonials);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  return { testimonials, isLoading, error };
}
