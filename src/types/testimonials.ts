
export interface SupabaseTestimonial {
  id: string;
  first_name: string;
  last_name: string;
  score: number | null;
  company: string | null;
  job_title: string | null;
  content: string;
  creation_date: string | null;
  source: string | null;
  source_link: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// This interface matches our existing Testimonial structure for compatibility
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  linkedinUrl?: string;
  imageUrl?: string;
  isLinkedIn?: boolean;
}

// Function to convert SupabaseTestimonial to our app's Testimonial format
export function mapSupabaseToTestimonial(supabaseTestimonial: SupabaseTestimonial): Testimonial {
  return {
    id: supabaseTestimonial.id,
    name: `${supabaseTestimonial.first_name} ${supabaseTestimonial.last_name}`,
    role: supabaseTestimonial.job_title || '',
    company: supabaseTestimonial.company || '',
    content: supabaseTestimonial.content,
    linkedinUrl: supabaseTestimonial.source === 'LinkedIn' ? supabaseTestimonial.source_link : undefined,
    imageUrl: supabaseTestimonial.image_url || undefined,
    isLinkedIn: supabaseTestimonial.source === 'LinkedIn'
  };
}
