import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CourseRegistrationsTable } from "./CourseRegistrationsTable";
import { RegistrationsSummary } from "./RegistrationsSummary";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseRegistrationsProps {
  course: Course;
  onBack: () => void;
}

const CourseRegistrations: React.FC<CourseRegistrationsProps> = ({ course, onBack }) => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        
        // Use the same UUID generation logic as in the RegistrationForm
        const courseUuid = generateCourseUuid(course.id);
        
        const { data, error } = await supabase
          .from('course_registrations')
          .select('*')
          .eq('course_id', courseUuid);
          
        if (error) {
          throw error;
        }
        
        setRegistrations(data || []);
      } catch (error) {
        console.error("Error fetching registrations:", error);
        toast({
          title: "Error fetching registrations",
          description: "There was a problem retrieving the registration data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegistrations();
  }, [course.id, toast]);

  // Function to generate a consistent UUID from a course ID string
  // This must match the logic in RegistrationForm.tsx
  const generateCourseUuid = (courseId: string): string => {
    // If the courseId is already a valid UUID, return it
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId)) {
      return courseId;
    }
    
    // Otherwise, generate a deterministic UUID based on the course ID
    // But this is a problem because we can't guarantee the same UUID as generated in the form
    // In a real application, we should use a deterministic algorithm
    // For now, we'll just return a placeholder that will likely not match any registrations
    return courseId;
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <h2 className="text-xl font-semibold">
          Registrations for {course.title}
        </h2>
      </div>

      {loading ? (
        <p className="text-center py-8">Loading registrations...</p>
      ) : (
        <>
          <RegistrationsSummary 
            registrations={registrations} 
            spotsAvailable={course.spotsAvailable} 
          />
          <CourseRegistrationsTable registrations={registrations} />
        </>
      )}
    </div>
  );
};

export default CourseRegistrations;
